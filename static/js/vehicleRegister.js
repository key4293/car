/* DOM 요소 */
const tableBody  = document.querySelector("#vehicleTable tbody");
const plateInput = document.getElementById("plate");
const typeInput  = document.getElementById("type");
const ownerInput = document.getElementById("owner");
const addBtn     = document.getElementById("addVehicleBtn");
const backBtn    = document.getElementById("backBtn");

/* 차량 번호 중복 체크 */
function isDuplicatePlate(plate) {
    const plates = document.querySelectorAll("#vehicleTable tbody tr td:first-child");
    return Array.from(plates).some(td => td.innerText === plate);
}

/* 차량 등록 */
addBtn.addEventListener("click", () => {
    const plate = plateInput.value.trim();
    const type  = typeInput.value.trim();
    const owner = ownerInput.value.trim();

    if (!plate || !type || !owner) {
        alert("모든 항목을 입력해 주세요.");
        return;
    }

    if (isDuplicatePlate(plate)) {
        alert("이미 등록된 차량 번호입니다.");
        return;
    }

    const row = document.createElement("tr");
    row.innerHTML = `
        <td>${plate}</td>
        <td>${type}</td>
        <td>${owner}</td>
        <td>
            <button class="delete-btn">삭제</button>
        </td>
    `;

    /* 삭제 버튼 */
    row.querySelector(".delete-btn").addEventListener("click", () => {
        row.remove();
    });

    tableBody.appendChild(row);

    plateInput.value = "";
    typeInput.value = "";
    ownerInput.value = "";
});

/* 메인 화면 이동 */
backBtn.addEventListener("click", () => {
    window.location.href = "index.html";
});
