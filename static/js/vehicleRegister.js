/* DOM 요소 */
const tableBody  = document.querySelector("#vehicleTable tbody");
const plateInput = document.getElementById("plate");
const typeInput  = document.getElementById("type");
const ownerInput = document.getElementById("owner");
const formEl     = document.getElementById("vehicleForm");
const backBtn    = document.getElementById("backBtn");

/* 테이블 렌더링 */
function renderVehicles(vehicles) {
    tableBody.innerHTML = "";

    vehicles.forEach(v => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${v.plate_number ?? ""}</td>
            <td>${v.vehicle_type ?? ""}</td>
            <td>${v.owner_name ?? ""}</td>
            <td>
                <button class="delete-btn" disabled>삭제</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

/* 차량 목록 불러오기 */
async function loadVehicles() {
    try {
        const res = await fetch("/vehicles", { method: "GET" });
        const data = await res.json();

        if (!res.ok || !data.ok) {
            alert(data.message || "차량 목록 조회 실패");
            return;
        }

        renderVehicles(data.data || []);
    } catch (e) {
        console.error(e);
        alert("서버 연결 실패");
    }
}

/* 차량 등록: form submit 가로채서 POST로 전송 */
formEl.addEventListener("submit", async (e) => {
    e.preventDefault();

    const plate = plateInput.value.trim();
    const type  = typeInput.value.trim();
    const owner = ownerInput.value.trim();

    if (!plate || !type || !owner) {
        alert("모든 항목을 입력해 주세요.");
        return;
    }

    try {
        const formData = new URLSearchParams();
        formData.append("plate_number", plate);
        formData.append("vehicle_type", type);
        formData.append("owner_name", owner);

        const res = await fetch("/register", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: formData.toString()
        });

        const data = await res.json();

        if (!res.ok || !data.ok) {
            alert(data.message || "등록 실패");
            return;
        }

        plateInput.value = "";
        typeInput.value = "";
        ownerInput.value = "";

        await loadVehicles();
        alert("차량 등록 완료!");
    } catch (e) {
        console.error(e);
        alert("서버 연결 실패");
    }
});

/* 메인 화면 이동 */
backBtn.addEventListener("click", () => {
    window.location.href = "/index";
});

/* 페이지 로드 시 목록 로딩 */
document.addEventListener("DOMContentLoaded", () => {
    loadVehicles();
});
