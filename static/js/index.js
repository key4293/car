// 로그인 여부 확인
if (!localStorage.getItem("loginUser")) {
    window.location.href = "login.html";
}

// CCTV
document.getElementById("cctvBtn").onclick = () => {
    window.location.href = "cctv.html";
};

// 업무일지
document.getElementById("workLogBtn").onclick = () => {
    window.location.href = "workLog.html";
};

// 차량 등록
document.getElementById("vehicleBtn").onclick = () => {
    window.location.href = "vehicleRegister.html";
};

// 로그아웃
document.getElementById("logoutBtn").onclick = () => {
    localStorage.removeItem("loginUser");
    window.location.href = "login.html";
};
