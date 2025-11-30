function confirmCancelDeclaration() {

    if (!declaredPlan) {
        showDialog("No declared plan found.");
        return;
    }

    const planId = declaredPlan.planId || declaredPlan.plan_id;
    const planObj = plansMap[planId] || {};
    const planCode = planObj.planCode || planObj.plan_code || "";
    const planNameEng = planObj.nameEng || planObj.name_eng || planObj.plan_name_eng || "";
    const updatedAtRaw = declaredPlan.updatedAt || declaredPlan.updated_at || declaredPlan.updatedAt;
    const updatedAtFormatted = formatTimeWithTimezone(updatedAtRaw);

    const fullMessage =
        `You have declared ${planCode} - ${planNameEng} as your plan on ${updatedAtFormatted} (${currentTimezone}).` +
        ` Are you sure you want to cancel this declaration?`;
    dialogMsg.textContent = fullMessage;

    dialogCloseBtn.style.display = "none";

    // Show confirm buttons
    dialogConfirmBtn.style.display = "inline-block";
    dialogCancelBtn.style.display = "inline-block";

    dialogEl.showModal();
}

async function actuallyCancelPlan() {
    try {
        const res = await fetch(`${API_PREFIX}/v1/students/${studentId}/declared-plan`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${keycloak.token}` },
        });

        if (res.status === 204 || res.status === 200) {
            declaredPlan = null;

            statusEl.textContent = "Declaration Status: Not Declared";
            enableDeclareFeature(true);
            cancelBtn.style.display = "none";
            changeBtn.style.display = "none";
            dropdownEl.value = ""
            declareBtn.style.display = "inline-block";
            declareBtn.disabled = true;
            showDialog("Declaration cancelled.");
            return;
        }

        if (res.status === 404) {
            declaredPlan = null;
            statusEl.textContent = "Declaration Status: Not Declared";
            enableDeclareFeature(true);
            cancelBtn.style.display = "none";
            changeBtn.style.display = "none";
            declareBtn.style.display = "inline-block";
            declareBtn.disabled = true;
            showDialog(`No declared plan found for student with id=${studentId}.`);
            dropdownEl.value = "";
            return;
        }

        if (res.status === 409) {
            showDialog(`Cannot cancel the declared plan because it is already cancelled.`);
            dropdownEl.value = "";
            return;
        }

         if (res.status === 500) {
        showDialog("There is a problem. Please try again later.");
        await loadDeclarationStatus();
        return;
        }
        showDialog("There is a problem. Please try again later.");
    } catch (err) {
        console.error("Error cancelling plan:", err);
        showDialog("There is a problem. Please try again later.");
    }
}