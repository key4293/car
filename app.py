from flask import Flask, request, render_template, redirect, url_for, send_from_directory, session
import pymysql
import os

app = Flask(__name__)
app.secret_key = "your_secret_key"  # 로그인 세션용

# MySQL 연결
conn = pymysql.connect(
    host='localhost',
    user='key474',
    password='key9587',
    database='project',
    charset='utf8mb4'
)

# 정적 파일 제공
@app.route('/css/<path:filename>')
def serve_css(filename):
    return send_from_directory(os.path.join(os.path.dirname(__file__), 'css'), filename)

@app.route('/js/<path:filename>')
def serve_js(filename):
    return send_from_directory(os.path.join(os.path.dirname(__file__), 'js'), filename)

# 로그인 화면
@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        # 간단 로그인 검증 예제
        if username == "admin" and password == "1234":
            session['loginUser'] = username
            return redirect(url_for('index'))
        else:
            return "로그인 실패", 401
    return render_template('login.html')

# 메인 화면
@app.route('/index')
def index():
    if 'loginUser' not in session:
        return redirect(url_for('login'))
    return render_template('index.html')

# 작업 로그 화면
@app.route('/workLog')
def work_log():
    if 'loginUser' not in session:
        return redirect(url_for('login'))
    return render_template('workLog.html')

# CCTV 화면
@app.route('/cctv')
def cctv():
    if 'loginUser' not in session:
        return redirect(url_for('login'))
    return render_template('cctv.html')

# 차량 등록 화면
@app.route('/vehicleRegister')
def vehicle_register():
    if 'loginUser' not in session:
        return redirect(url_for('login'))
    return render_template('vehicleRegister.html')

# 등록 처리
@app.route('/register', methods=['POST'])  # POST만 허용
def register():
    if 'loginUser' not in session:
        return "로그인 필요", 401
    try:
        plate_number = request.form['plate_number']
        vehicle_type = request.form['vehicle_type']
        owner_name = request.form['owner_name']

        cur = conn.cursor()
        # camera_id 제거, registered_at은 DEFAULT CURRENT_TIMESTAMP 사용
        sql = """
            INSERT INTO vehicle (plate_number, vehicle_type, owner_name)
            VALUES (%s, %s, %s)
        """
        cur.execute(sql, (plate_number, vehicle_type, owner_name))
        conn.commit()
        cur.close()
        return "차량 등록 완료!"
    except Exception as e:
        return f"에러 발생: {e}"

# Flask 서버 실행
if __name__ == '__main__':
    app.run(debug=True, port=5001)
