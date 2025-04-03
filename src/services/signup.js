var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
// Helper to safely get and cast DOM elements
function getElement(id) {
    var el = document.getElementById(id);
    if (!el)
        throw new Error("Element with ID '".concat(id, "' not found"));
    return el;
}
// Form elements
var form = getElement("signupForm");
var signupBtn = getElement("signupBtn");
var emailInput = getElement("email");
var passwordInput = getElement("password");
var firstNameInput = getElement("firstName");
var lastNameInput = getElement("lastName");
var emailError = getElement("emailError");
var passwordError = getElement("passwordError");
var signupError = getElement("signupError");
var spinner = getElement("spinner");
var btnText = getElement("signupBtnText");
// Email validation
var validateEmail = function (email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};
// Live validation
var validateForm = function () {
    var emailValid = validateEmail(emailInput.value);
    var passwordValid = passwordInput.value.length >= 6;
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
form.addEventListener("submit", function (e) { return __awaiter(_this, void 0, void 0, function () {
    var data, response, result, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                e.preventDefault();
                signupError.textContent = "";
                signupBtn.disabled = true;
                spinner.style.display = "inline-block";
                btnText.textContent = "Signing up...";
                data = {
                    firstName: firstNameInput.value,
                    lastName: lastNameInput.value,
                    email: emailInput.value,
                    password: passwordInput.value,
                };
                _a.label = 1;
            case 1:
                _a.trys.push([1, 4, 5, 6]);
                return [4 /*yield*/, fetch("https://<your-render-backend-url>/api/auth/signup", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(data),
                    })];
            case 2:
                response = _a.sent();
                return [4 /*yield*/, response.json()];
            case 3:
                result = _a.sent();
                if (response.ok) {
                    alert("Signup successful!");
                    window.location.href = "/login/";
                }
                else {
                    signupError.textContent = result.message || "Signup failed.";
                }
                return [3 /*break*/, 6];
            case 4:
                err_1 = _a.sent();
                signupError.textContent = "Something went wrong. Please try again.";
                console.error("Signup error:", err_1);
                return [3 /*break*/, 6];
            case 5:
                signupBtn.disabled = false;
                spinner.style.display = "none";
                btnText.textContent = "Sign Up";
                return [7 /*endfinally*/];
            case 6: return [2 /*return*/];
        }
    });
}); });
