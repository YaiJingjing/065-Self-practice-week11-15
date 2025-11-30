async function changePlan() {
    const newPlanId = Number(dropdownEl.value);

    if (!newPlanId) {
        showDialog("Please select a plan first.");
        return;
    }

    const currentId = declaredPlan.planId ?? declaredPlan.plan_id;

    if (newPlanId === currentId) {
        showDialog("You already declared this plan.");
        return;
    }

    try {
        const res = await fetch(`${API_PREFIX}/v1/students/${studentId}/declared-plan`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${keycloak.token}`,
            },
            body: JSON.stringify({ planId: newPlanId }),
        });

        if (res.status === 200) {
            declaredPlan = await res.json();
            updateChangeButtonState();
            updateStatusDisplay();

            enableDeclareFeature(false);
            cancelBtn.style.display = "inline-block";
            changeBtn.style.display = "inline-block";

            showDialog("Declaration updated.");
            return;
        }

        if (res.status === 404) {
            declaredPlan = null;
            statusEl.textContent = "Declaration Status: Not Declared";
            dropdownEl.value = "";

            enableDeclareFeature(true);
            cancelBtn.style.display = "none";
            changeBtn.style.display = "none";
            declareBtn.style.display = "inline-block";
            declareBtn.disabled = true;
            showDialog(`No declared plan found for student with id=${studentId}.`);
            return;
        }

        if (res.status === 409) {
            showDialog("Cannot update the declared plan because it has been cancelled.")
            dropdownEl.value = "";
            return;
        }

        showDialog("There is a problem. Please try again later.");

    } catch (err) {
        console.error("Error changing plan:", err);
        showDialog("There is a problem. Please try again later.");
    }
}
