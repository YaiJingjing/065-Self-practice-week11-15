async function declarePlan() {
    const planId = Number(dropdownEl.value);
    if (!Number.isInteger(planId) || planId <= 0) {
        showDialog("Invalid plan selected.");
        return;
    }
    let res;
    try {
        res = await fetch(`${API_PREFIX}/v1/students/${studentId}/declared-plan`, {
         method: "POST",
         headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${keycloak.token}`,
        },
        body: JSON.stringify({ planId }),
    });
   } catch (err) {
        showDialog("There is a problem. Please try again later.")
     return;
   }
    if (res.status === 201) {
        const newRecord = await res.json();
        declaredPlan = newRecord;
        updateStatusDisplay();
        updateChangeButtonState();
        enableDeclareFeature(false);
        cancelBtn.style.display = "inline-block";
        changeBtn.style.display = "inline-block";
        return;
    }

    if (res.status === 409) {
        showDialog("You may have declared study plan already. Please check again.");
        await loadDeclarationStatus();
        return;
    }

     if (res.status === 500) {
        showDialog("There is a problem. Please try again later.");
        await loadDeclarationStatus();
        return;
    }

    if (res.message) {
        showDialog("There is a problem. Please try again later.");
        return;
    }
    showDialog("There is a problem. Please try again later.");
}