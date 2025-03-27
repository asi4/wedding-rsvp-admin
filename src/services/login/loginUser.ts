async function loginUser(email: string, password: string) {
    try {
        const response: Response = await fetch("https://your-backend-url.com/api/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Login failed");
        }

        // Save the JWT token in localStorage
        localStorage.setItem("token", data.token);

        // Redirect or do something after login
        window.location.href = "/dashboard.html";

    } catch (error: any) {
        console.error("❌ Login error:", error.message);
        alert(`Login failed: ${error.message}`);
    }
}
