/* DOM 요소 */
const logList      = document.getElementById("logList");
const timeSelect   = document.getElementById("timeSlot");
const workTypeInp  = document.getElementById("workType");
const workContInp  = document.getElementById("workContent");
const issueInput   = document.getElementById("issue");
const countInput   = document.getElementById("itemCount");
const saveBtn      = document.getElementById("saveBtn");
const backBtn      = document.getElementById("backBtn");

/* 오늘 날짜 YYYY-MM-DD */
function getToday() {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
}

/* 시간대 숫자 → 텍스트 */
function hourToText(hour) {
    const h = parseInt(hour, 10);
    const start = String(h).padStart(2, "0") + ":00";
    const end = h === 23 ? "24:00" : String(h + 1).padStart(2, "0") + ":00";
    return `${start} ~ ${end}`;
}

/* 목록 렌더링 */
function renderLogs(rows) {
    logList.innerHTML = "";

    if (!rows || rows.length === 0) {
        const empty = document.createElement("div");
        empty.className = "empty";
        empty.textContent = "오늘 작성된 업무일지가 없습니다.";
        logList.appendChild(empty);
        return;
    }

    rows.forEach(log => {
        const logItem = document.createElement("div");
        logItem.className = "log-item";
        logItem.innerHTML = `
            <div class="log-content">
                <div><strong>${hourToText(log.work_hour)}</strong> (worker_id: ${log.worker_id})</div>
                <div>업무구분: ${log.work_type ?? ""}</div>
                <div>업무내용: ${log.work_content ?? ""}</div>
                <div>특이사항: ${log.special_note ?? ""}</div>
                <div>물품 수량: ${log.item_count ?? 0}개</div>
                <div class="log-meta">
                    created_at: ${log.created_at ?? ""}<br>
                    updated_at: ${log.updated_at ?? ""}
                </div>
            </div>
        `;
        logList.appendChild(logItem);
    });
}

/* 업무일지 목록 불러오기(오늘) */
async function loadLogs() {
    try {
        const date = encodeURIComponent(getToday());
        const res = await fetch(`/api/worklog?date=${date}`);
        const json = await res.json();

        if (!json.ok) {
            alert(json.message || "업무일지 조회 실패");
            return;
        }

        renderLogs(json.data);
    } catch (e) {
        alert("서버 통신 오류(목록 조회)");
        console.error(e);
    }
}

/* 업무일지 저장 */
saveBtn.addEventListener("click", async () => {
    const workHour = parseInt(timeSelect.value, 10);
    const workType = (workTypeInp.value || "").trim();
    const workCont = (workContInp.value || "").trim();
    const issue    = (issueInput.value || "").trim();
    const count    = parseInt(countInput.value, 10);

    if (!workType || !workCont || !issue || isNaN(count)) {
        alert("업무 구분, 업무 내용, 특이사항, 물품 수량을 모두 입력해 주세요.");
        return;
    }

    if (count < 0) {
        alert("물품 수량은 0 이상이어야 합니다.");
        return;
    }

    saveBtn.disabled = true;

    const payload = {
        work_date: getToday(),
        work_hour: workHour,
        work_type: workType,
        work_content: workCont,
        special_note: issue,
        item_count: count
    };

    try {
        const res = await fetch("/api/worklog", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        const json = await res.json();

        if (!json.ok) {
            alert(json.message || "업무일지 저장 실패");
            return;
        }

        // 입력 초기화
        issueInput.value = "";
        countInput.value = "";

        // 저장 직후 목록 갱신
        await loadLogs();
    } catch (e) {
        alert("서버 통신 오류(저장)");
        console.error(e);
    } finally {
        saveBtn.disabled = false;
    }
});

/* 메인 이동 */
backBtn.addEventListener("click", () => {
    window.location.href = "/index";
});

/* 페이지 진입 시 목록 로드 */
document.addEventListener("DOMContentLoaded", () => {
    // 기본값 세팅(원하시면 제거 가능)
    if (workTypeInp && !workTypeInp.value) workTypeInp.value = "물품점검";
    if (workContInp && !workContInp.value) workContInp.value = "경비실 물품 점검";
    loadLogs();
});
