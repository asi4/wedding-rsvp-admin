const signupForm = document.getElementById("signupForm");
const signupBtn = document.getElementById("signupBtn");
const signupBtnText = document.getElementById("signupBtnText");
const spinner = document.getElementById("spinner");
const signupError = document.getElementById("signupError");

const firstName = document.getElementById("firstName");
const lastName = document.getElementById("lastName");
const emailInput = document.getElementById("email");
const password = document.getElementById("password");

const emailError = document.getElementById("emailError");
const passwordError = document.getElementById("passwordError");

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateForm() {
    const emailValid = emailPattern.test(emailInput.value);
    const passwordValid = password.value.length >= 6;
    const isValid =
        firstName.value.trim() &&
        lastName.value.trim() &&
        emailValid &&
        passwordValid;

    signupBtn.disabled = !isValid;

    // Live feedback: remove error if fixed
    if (emailValid) {
        emailInput.classList.remove("invalid");
        emailError.style.display = "none";
    }

    if (passwordValid) {
        password.classList.remove("invalid");
        passwordError.style.display = "none";
    }
}

emailInput.addEventListener("input", () => {
    if (!emailPattern.test(emailInput.value)) {
        emailInput.classList.add("invalid");
        emailError.textContent = "Please enter a valid email address";
        emailError.style.display = "block";
    }
    validateForm();
});

password.addEventListener("input", () => {
    if (password.value.length < 6) {
        password.classList.add("invalid");
        passwordError.textContent = "Password must be at least 6 characters";
        passwordError.style.display = "block";
    }
    validateForm();
});

[firstName, lastName].forEach(input =>
    input.addEventListener("input", validateForm)
);

signupForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    signupBtn.disabled = true;
    signupBtnText.style.display = "none";
    spinner.style.display = "inline";

    try {
        const res = await fetch("https://wedding-rsvp-admin.onrender.com/api/signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                firstName: firstName.value.trim(),
                lastName: lastName.value.trim(),
                email: emailInput.value.trim(),
                password: password.value
            })
        });

        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.message || "Signup failed");
        }

        localStorage.setItem("token", data.token);
        window.location.href = "/dashboard.html";
    } catch (error) {
        signupError.textContent = error.message;
    } finally {
        signupBtn.disabled = false;
        signupBtnText.style.display = "inline";
        spinner.style.display = "none";
    }
});