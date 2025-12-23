const loginBtn = document.getElementById("loginBtn");
const statusText = document.getElementById("statusText");

loginBtn.addEventListener("click", () => {

    const id = document.getElementById("username").value;
    const pw = document.getElementById("password").value;

    // 로그인 검증 (예제용)
    if (id === "admin" && pw === "1234") {

        // 로그인 정보 저장
        localStorage.setItem("loginUser", id);

        // 메인 윈도우로 이동
        window.location.href = "index.html";

    } else {
        statusText.textContent = "로그인 실패. 다시 시도하세요.";
        statusText.style.color = "#ff6b6b";
    }
});
