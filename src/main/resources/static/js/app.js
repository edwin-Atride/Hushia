
document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("loginForm");

    if (form) {
        form.addEventListener("submit", (event) => {
            event.preventDefault();

            document.getElementById("loginMessage").textContent =
                "La connexion sera disponible prochainement.";
        });
    }
});
