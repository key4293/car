/* 로그인 체크 */
if (!localStorage.getItem("loginUser")) {
    window.location.href = "login.html";
}

/* DOM 요소 */
const logList    = document.getElementById("logList");
const timeSelect = document.getElementById("timeSlot");
const issueInput = document.getElementById("issue");
const countInput = document.getElementById("itemCount");
const saveBtn    = document.getElementById("saveBtn");
const backBtn    = document.getElementById("backBtn");

/* 업무일지 저장 */
saveBtn.addEventListener("click", () => {
    const time  = timeSelect.value;
    const issue = issueInput.value.trim();
    const count = countInput.value.trim();

    if (!issue || !count) {
        alert("모든 항목을 입력해 주세요.");
        return;
    }

    const logItem = document.createElement("div");
    logItem.className = "log-item";
    logItem.innerHTML = `
        <div class="log-content">
            <strong>${time}</strong><br>
            특이사항: ${issue}<br>
            물품 수량: ${count}개
        </div>
        <button class="delete-log-btn">삭제</button>
    `;

    /* 삭제 버튼 */
    logItem.querySelector(".delete-log-btn").addEventListener("click", () => {
        logItem.remove();
    });

    logList.prepend(logItem);

    issueInput.value = "";
    countInput.value = "";
});

/* 메인 이동 */
backBtn.addEventListener("click", () => {
    window.location.href = "mainWindow.html";
});
