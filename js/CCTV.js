// 로그인 체크
if (!localStorage.getItem("loginUser")) {
    window.location.href = "login.html";
}

const logArea = document.getElementById("logArea");

function addLog(msg) {
    const time = new Date().toLocaleTimeString();
    logArea.innerHTML += `[${time}] ${msg}<br>`;
    logArea.scrollTop = logArea.scrollHeight;
}

// 초기 로그
addLog("CCTV 시스템 접속");
addLog("카메라 연결 중...");

setTimeout(() => {
    addLog("CCTV 1~4 연결 완료");
}, 1000);

// 메인 이동
document.getElementById("backBtn").addEventListener("click", () => {
    window.location.href = "index.html";
});
