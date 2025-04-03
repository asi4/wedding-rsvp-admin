// Helper to safely get and cast DOM elements
function getElement<T extends HTMLElement>(id: string): T {
    const el = document.getElementById(id);
    if (!el) throw new Error(`Element with ID '${id}' not found`);
    return el as T;
}

// Form elements
const form = getElement<HTMLFormElement>("signupForm");
const signupBtn = getElement<HTMLButtonElement>("signupBtn");
const emailInput = getElement<HTMLInputElement>("email");
const passwordInput = getElement<HTMLInputElement>("password");
const firstNameInput = getElement<HTMLInputElement>("firstName");
const lastNameInput = getElement<HTMLInputElement>("lastName");

const emailError = getElement<HTMLElement>("emailError");
const passwordError = getElement<HTMLElement>("passwordError");
const signupError = getElement<HTMLElement>("signupError");
const spinner = getElement<HTMLElement>("spinner");
const btnText = getElement<HTMLElement>("signupBtnText");

// Email validation
const validateEmail = (email: string): boolean =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

// Live validation
const validateForm = (): void => {
    const emailValid = validateEmail(emailInput.value);
    const passwordValid = passwordInput.value.length >= 6;

    emailError.style.display = emailValid ? "none" : "block";
    passwordError.style.display = passwordValid ? "none" : "block";

    emailInput.classList.toggle("invalid", !emailValid);
    passwordInput.classList.toggle("invalid", !passwordValid);

    signupBtn.disabled = !(emailValid && passwordValid);
};

// Bind input listeners
emailInput.addEventListener("input", validateForm);
passwordInput.addEventListener("input", validateForm);

// Form submission
form.addEventListener("submit", async (e: SubmitEvent) => {
    e.preventDefault();
    signupError.textContent = "";
    signupBtn.disabled = true;
    spinner.style.display = "inline-block";
    btnText.textContent = "Signing up...";

    const data = {
        firstName: firstNameInput.value,
        lastName: lastNameInput.value,
        email: emailInput.value,
        password: passwordInput.value,
    };

    try {
        const response = await fetch("https://<your-render-backend-url>/api/auth/signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });

        const result = await response.json();

        if (response.ok) {
            alert("Signup successful!");
            window.location.href = "/login/";
        } else {
            signupError.textContent = result.message || "Signup failed.";
        }
    } catch (err) {
        signupError.textContent = "Something went wrong. Please try again.";
        console.error("Signup error:", err);
    } finally {
        signupBtn.disabled = false;
        spinner.style.display = "none";
        btnText.textContent = "Sign Up";
    }
});
