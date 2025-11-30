const API="/intproj25/pl2/itb-ecors/api";

document.addEventListener("DOMContentLoaded", () => {
    const dialog = document.querySelector('.ecors-dialog');
    const body = document.getElementById("study-body");
    const table = document.getElementById("table");


    fetch (`${API}/v1/study-plans`)
        .then((res) => {
            if (!res.ok) throw new Error("Backend error");
            return res.json();
        })
        .then((data) => {
            if (dialog && dialog.open) dialog.close();

            if (data.length === 0){
                const pElem = document.createElement("p");
                pElem.textContent = "No data available";
                body.appendChild(pElem)
                return;
            }
            console.log(data)
            data.forEach((s) => {
                const row = document.createElement("tr");
                row.classList.add('ecors-row');
                row.innerHTML = `
            <td class="ecors-id">${s.id}</td>
            <td class="ecors-planCode">${s.planCode}</td>
            <td class="ecors-nameEng">${s.nameEng}</td>
            <td class="ecors-nameTh">${s.nameTh}</td>
            `;
                table.appendChild(row);
            });
        })
        .catch(() =>{
            if (dialog) dialog.showModal();
        });
});