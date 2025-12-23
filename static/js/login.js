const loginBtn = document.getElementById("loginBtn");
const statusText = document.getElementById("statusText");

loginBtn.addEventListener("click", async () => {

    const id = document.getElementById("username").value.trim();
    const pw = document.getElementById("password").value.trim();

    if (!id || !pw) {
        statusText.textContent = "ID와 비밀번호를 입력하세요.";
        statusText.style.color = "#ff6b6b";
        return;
    }

    try {
        const formData = new URLSearchParams();
        formData.append("username", id);
        formData.append("password", pw);

        const response = await fetch("/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: formData.toString()
        });

        if (response.ok) {
            window.location.href = "/index";
        } else {
            statusText.textContent = "로그인 실패. ID/PW를 확인하세요.";
            statusText.style.color = "#ff6b6b";
        }

    } catch (error) {
        statusText.textContent = "서버 연결 실패";
        statusText.style.color = "#ff6b6b";
        console.error(error);
    }
});