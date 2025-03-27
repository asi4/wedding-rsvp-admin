export async function login(email: string, password: string) {
    const response: Response = await fetch("https://wedding-rsvp-admin.onrender.com/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
        console.log(`Error in login: -${response.body}-`)
        throw new Error("Login failed");
    }

    return response.json(); // Should return token and user info
}
