from flask import Flask, request, render_template, redirect, url_for, session, jsonify
import pymysql

# Flask 기본 규칙:
# - HTML: templates 폴더
# - CSS/JS/이미지: static 폴더
app = Flask(__name__, static_folder="static", template_folder="templates")
app.secret_key = "your_secret_key"

# MySQL 연결
conn = pymysql.connect(
    host="localhost",
    user="key474",
    password="key9587",
    database="project",
    charset="utf8mb4",
    autocommit=False
)

def is_logged_in():
    return "loginUser" in session

#로그인 유저명을 worker_id로 매핑
def get_worker_id_from_session():
    username = session.get("loginUser")
    if username == "admin":
        return 1
    return 1


# 로그인
@app.route("/login", methods=["GET", "POST"])
def login():
    if request.method == "POST":
        username = request.form.get("username", "").strip()
        password = request.form.get("password", "").strip()

        # 간단 로그인 검증 예제
        if username == "admin" and password == "1234":
            session["loginUser"] = username

            # fetch() 로그인 대응
            if request.headers.get("X-Requested-With") == "XMLHttpRequest" or \
               "application/json" in (request.headers.get("Accept") or ""):
                return jsonify({"ok": True, "redirect": url_for("index")})

            return redirect(url_for("index"))

        if request.headers.get("X-Requested-With") == "XMLHttpRequest" or \
           "application/json" in (request.headers.get("Accept") or ""):
            return jsonify({"ok": False, "message": "로그인 실패"}), 401

        return "로그인 실패", 401

    return render_template("login.html")


# 메인 화면
@app.route("/")
def home():
    if not is_logged_in():
        return redirect(url_for("login"))
    return redirect(url_for("index"))


@app.route("/index")
def index():
    if not is_logged_in():
        return redirect(url_for("login"))
    return render_template("index.html")


# 작업 로그 화면
@app.route("/workLog")
def work_log():
    if not is_logged_in():
        return redirect(url_for("login"))
    return render_template("workLog.html")


# 업무일지 저장 API
@app.route("/api/worklog", methods=["POST"])
def create_worklog():
    if not is_logged_in():
        return jsonify({"ok": False, "message": "로그인 필요"}), 401

    data = request.get_json() or {}

    work_date = data.get("work_date")      # "YYYY-MM-DD"
    work_hour = data.get("work_hour")      # 0~23 (int)
    special_note = (data.get("special_note") or "").strip()
    item_count = data.get("item_count", 0)

    # 이 화면에서는 아래 2개는 고정값으로 처리
    work_type = "물품점검"
    work_content = "경비실 물품 점검"

    if not work_date or work_hour is None:
        return jsonify({"ok": False, "message": "필수 값 누락"}), 400
    if not special_note:
        return jsonify({"ok": False, "message": "특이사항을 입력해 주세요."}), 400
    try:
        item_count = int(item_count)
        work_hour = int(work_hour)
    except:
        return jsonify({"ok": False, "message": "수량/시간대 값이 올바르지 않습니다."}), 400

    # ※ 추가: worker_id 필수 컬럼 대응
    worker_id = get_worker_id_from_session()

    try:
        with conn.cursor() as cur:
            sql = """
                INSERT INTO work_log
                (work_date, work_hour, worker_id, work_type, work_content, special_note, item_count)
                VALUES (%s, %s, %s, %s, %s, %s, %s)
            """
            cur.execute(sql, (work_date, work_hour, worker_id, work_type, work_content, special_note, item_count))
            log_id = cur.lastrowid
        conn.commit()
        return jsonify({"ok": True, "log_id": log_id})
    except Exception as e:
        conn.rollback()
        return jsonify({"ok": False, "message": f"에러 발생: {e}"}), 500


# 업무일지 목록 조회 API
@app.route("/api/worklog", methods=["GET"])
def list_worklog():
    if not is_logged_in():
        return jsonify({"ok": False, "message": "로그인 필요"}), 401

    date = request.args.get("date")

    try:
        with conn.cursor(pymysql.cursors.DictCursor) as cur:
            if date:
                sql = """
                    SELECT log_id, work_date, work_hour, worker_id, work_type, work_content,
                           special_note, item_count, created_at, updated_at
                    FROM work_log
                    WHERE work_date = %s
                    ORDER BY work_hour ASC, log_id DESC
                """
                cur.execute(sql, (date,))
            else:
                sql = """
                    SELECT log_id, work_date, work_hour, worker_id, work_type, work_content,
                           special_note, item_count, created_at, updated_at
                    FROM work_log
                    ORDER BY work_date DESC, work_hour ASC, log_id DESC
                    LIMIT 200
                """
                cur.execute(sql)

            rows = cur.fetchall()

        return jsonify({"ok": True, "data": rows})
    except Exception as e:
        return jsonify({"ok": False, "message": f"에러 발생: {e}"}), 500


# CCTV 화면
@app.route("/cctv")
def cctv():
    if not is_logged_in():
        return redirect(url_for("login"))
    return render_template("cctv.html")


# 차량 등록 화면
@app.route("/vehicleRegister")
def vehicle_register():
    if not is_logged_in():
        return redirect(url_for("login"))
    return render_template("vehicleRegister.html")


# 차량 등록 처리
@app.route("/register", methods=["POST"])
def register():
    if not is_logged_in():
        return jsonify({"ok": False, "message": "로그인 필요"}), 401

    plate_number = (request.form.get("plate_number") or "").strip()
    vehicle_type = (request.form.get("vehicle_type") or "").strip()
    owner_name = (request.form.get("owner_name") or "").strip()

    if not plate_number or not vehicle_type or not owner_name:
        return jsonify({"ok": False, "message": "필수 값 누락"}), 400

    try:
        with conn.cursor() as cur:
            sql = """
                INSERT INTO vehicle (plate_number, vehicle_type, owner_name)
                VALUES (%s, %s, %s)
            """
            cur.execute(sql, (plate_number, vehicle_type, owner_name))
        conn.commit()
        return jsonify({"ok": True, "message": "차량 등록 완료!"})
    except Exception as e:
        conn.rollback()
        return jsonify({"ok": False, "message": f"에러 발생: {e}"}), 500


# 차량 목록 조회
@app.route("/vehicles", methods=["GET"])
def vehicles():
    if not is_logged_in():
        return jsonify({"ok": False, "message": "로그인 필요"}), 401

    try:
        with conn.cursor(pymysql.cursors.DictCursor) as cur:
            cur.execute("""
                SELECT plate_number, vehicle_type, owner_name
                FROM vehicle
                ORDER BY plate_number ASC
                LIMIT 200
            """)
            rows = cur.fetchall()
        return jsonify({"ok": True, "data": rows})
    except Exception as e:
        return jsonify({"ok": False, "message": f"에러 발생: {e}"}), 500


# 로그아웃
@app.route("/logout")
def logout():
    session.pop("loginUser", None)
    return redirect(url_for("login"))


if __name__ == "__main__":
    app.run(debug=True, port=5000)
