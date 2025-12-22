from flask import Flask, request, render_template_string
import pymysql
import os

app = Flask(__name__)

# MySQL 연결
conn = pymysql.connect(
    host='localhost',
    user='key474',
    password='key9587',
    database='vehicle',
    charset='utf8mb4'
)

# 차량등록 화면
@app.route('/')
def index():
    # HTML 뼈대 파일 읽어오기
    html_path = os.path.join(os.path.dirname(__file__), 'vehicleRegister.html')
    with open(html_path, 'r', encoding='utf-8') as f:
        html_content = f.read()
    return render_template_string(html_content)

# 등록 처리
@app.route('/register', methods=['POST'])
def register():
    plate_number = request.form['plate_number']
    vehicle_type = request.form['vehicle_type']
    owner_name = request.form['owner_name']

    cur = conn.cursor()
    sql = """
        INSERT INTO vehicle (camera_id, plate_number, vehicle_type, owner_name, registered_at)
        VALUES (1, %s, %s, %s, NOW())
    """
    cur.execute(sql, (plate_number, vehicle_type, owner_name))
    conn.commit()
    cur.close()

    return "차량 등록 완료!"

if __name__ == '__main__':
    app.run(debug=True)
