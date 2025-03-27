const loginForm: HTMLElement = document.getElementById("loginForm");
const errorMessage: HTMLElement | null = document.getElementById("errorMessage");

loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    try {
        const response: Response = await fetch("https://your-backend-url.com/api/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Login failed");
        }

        // Save token to localStorage
        localStorage.setItem("token", data.token);

        // Redirect to protected dashboard page
        window.location.href = "/dashboard.html";
    } catch (error) {
        errorMessage.textContent = error.message;
    }
});
