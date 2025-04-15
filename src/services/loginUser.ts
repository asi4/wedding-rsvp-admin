const loginForm = document.getElementById("loginForm") as HTMLFormElement;
const loginEmailInput = document.getElementById("email") as HTMLInputElement;
const loginPasswordInput = document.getElementById("password") as HTMLInputElement;
const loginError = document.getElementById("loginError") as HTMLElement;
const loginButton = document.querySelector(".btn-login") as HTMLButtonElement;

loginForm.addEventListener("submit", async (e: SubmitEvent) => {
    e.preventDefault();

    loginError.style.display = "none";
    loginButton.disabled = true;
    loginButton.textContent = "Logging in...";

    const data = {
        email: loginEmailInput.value,
        password: loginPasswordInput.value
    };

    try {
        const response = await fetch("https://wedding-rsvp-admin.onrender.com/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (response.ok) {
            localStorage.setItem("token", result.token);
            console.log("Token on dashboard load:", token);
            // Slight delay to ensure localStorage is saved before redirect
            setTimeout(() => {
                window.location.href = "/dashboard.html";
            }, 100);
        } else {
            loginError.textContent = result.message || "Login failed";
            loginError.style.display = "block";
        }
    } catch (err: any) {
        console.error("Login error:", err);
        loginError.textContent = err.message || "Network error. Please try again.";
        loginError.style.display = "block";
    } finally {
        loginButton.disabled = false;
        loginButton.textContent = "Login";
    }
});
