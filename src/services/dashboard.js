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
var API_BASE = "https://wedding-rsvp-admin.onrender.com/api";
var token = localStorage.getItem("token");
if (!token)
    window.location.href = "/login.html";
var userCSVs = new Map();
function fetchUsers() {
    return __awaiter(this, void 0, void 0, function () {
        var res, errorMsg, users, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 5, , 6]);
                    return [4 /*yield*/, fetch("".concat(API_BASE, "/users"), {
                            headers: { Authorization: "Bearer ".concat(token) }
                        })];
                case 1:
                    res = _a.sent();
                    if (!!res.ok) return [3 /*break*/, 3];
                    return [4 /*yield*/, res.text()];
                case 2:
                    errorMsg = _a.sent();
                    throw new Error("API error: ".concat(res.status, " - ").concat(errorMsg));
                case 3: return [4 /*yield*/, res.json()];
                case 4:
                    users = _a.sent();
                    if (!Array.isArray(users)) {
                        throw new TypeError("Expected users to be an array");
                    }
                    renderUsers(users);
                    return [3 /*break*/, 6];
                case 5:
                    err_1 = _a.sent();
                    console.error("Failed to fetch users", err_1);
                    return [3 /*break*/, 6];
                case 6: return [2 /*return*/];
            }
        });
    });
}
function renderUsers(users) {
    var tbody = document.querySelector("#userTable tbody");
    tbody.innerHTML = "";
    users.forEach(function (user) {
        if (!user)
            return;
        var tr = document.createElement("tr");
        var statusClass = user.isActive ? "active" : "inactive";
        var statusText = user.isActive ? "Active" : "Inactive";
        tr.innerHTML = "\n            <td>".concat(user.firstName || "", "</td>\n            <td>").concat(user.lastName || "", "</td>\n            <td>").concat(user.email || "", "</td>\n            <td class=\"status ").concat(statusClass, "\">").concat(statusText, "</td>\n            <td>\n                <div>\n                    <label>Upload CSV or Excel</label><br/>\n                    <input type=\"file\" data-userid=\"").concat(user._id, "\" class=\"file-upload\" /><br/><br/>\n\n                    <label>Import from Google Sheet</label><br/>\n                    <input type=\"text\" placeholder=\"Paste Google Sheet link\" class=\"google-sheet-url\" />\n                    <button data-userid=\"").concat(user._id, "\" class=\"google-sheet-upload\">Import</button><br/><br/>\n\n                    <button class=\"icon-btn download-btn\" data-userid=\"").concat(user._id, "\">\uD83D\uDCE5</button>\n                    <button class=\"icon-btn delete-btn\" data-userid=\"").concat(user._id, "\">\uD83D\uDDD1\uFE0F</button>\n                </div>\n            </td>\n        ");
        tbody.appendChild(tr);
    });
}
function toggleStatus(userId, isActive) {
    return __awaiter(this, void 0, void 0, function () {
        var err_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, fetch("".concat(API_BASE, "/users/").concat(userId), {
                            method: "PUT",
                            headers: {
                                "Content-Type": "application/json",
                                Authorization: "Bearer ".concat(token)
                            },
                            body: JSON.stringify({ isActive: isActive })
                        })];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, fetchUsers()];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    err_2 = _a.sent();
                    console.error("Failed to update status", err_2);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
function deleteUser(userId) {
    return __awaiter(this, void 0, void 0, function () {
        var err_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!confirm("Are you sure you want to delete this user?"))
                        return [2 /*return*/];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, , 5]);
                    return [4 /*yield*/, fetch("".concat(API_BASE, "/users/").concat(userId), {
                            method: "DELETE",
                            headers: { Authorization: "Bearer ".concat(token) }
                        })];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, fetchUsers()];
                case 3:
                    _a.sent();
                    return [3 /*break*/, 5];
                case 4:
                    err_3 = _a.sent();
                    console.error("Failed to delete user", err_3);
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    });
}
function logout() {
    localStorage.removeItem("token");
    window.location.href = "/login.html";
}
function uploadSpreadsheet(event, userId) {
    return __awaiter(this, void 0, void 0, function () {
        var input, file_1, allowedTypes, allowedExtensions, isMimeValid, isExtensionValid, formData, res, err_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    input = event.target;
                    if (!(input.files && input.files[0])) return [3 /*break*/, 4];
                    file_1 = input.files[0];
                    allowedTypes = [
                        "text/csv",
                        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                    ];
                    allowedExtensions = [".csv", ".xlsx"];
                    isMimeValid = allowedTypes.includes(file_1.type);
                    isExtensionValid = allowedExtensions.some(function (ext) { return file_1.name.toLowerCase().endsWith(ext); });
                    if (!isMimeValid && !isExtensionValid) {
                        alert("Only .csv and .xlsx files are supported.");
                        return [2 /*return*/];
                    }
                    formData = new FormData();
                    formData.append("csv", file_1);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, fetch("".concat(API_BASE, "/users/").concat(userId, "/upload"), {
                            method: "POST",
                            headers: {
                                Authorization: "Bearer ".concat(token)
                            },
                            body: formData
                        })];
                case 2:
                    res = _a.sent();
                    if (!res.ok)
                        throw new Error("Upload failed");
                    userCSVs.set(userId, file_1); // ✅ Track uploaded file
                    alert("File '".concat(file_1.name, "' uploaded successfully."));
                    return [3 /*break*/, 4];
                case 3:
                    err_4 = _a.sent();
                    console.error("File upload failed:", err_4);
                    alert("Failed to upload file.");
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
function uploadGoogleSheet(sheetUrl, userId) {
    return __awaiter(this, void 0, void 0, function () {
        var res, data, err_5;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!sheetUrl.includes("docs.google.com/spreadsheets")) {
                        alert("Please enter a valid Google Sheet URL.");
                        return [2 /*return*/];
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, , 5]);
                    return [4 /*yield*/, fetch("".concat(API_BASE, "/users/").concat(userId, "/upload-from-google"), {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                                Authorization: "Bearer ".concat(token)
                            },
                            body: JSON.stringify({ sheetUrl: sheetUrl })
                        })];
                case 2:
                    res = _a.sent();
                    if (!res.ok)
                        throw new Error("Google Sheet upload failed");
                    return [4 /*yield*/, res.json()];
                case 3:
                    data = _a.sent();
                    alert("Google Sheet imported successfully with ".concat(data.rows, " rows."));
                    return [3 /*break*/, 5];
                case 4:
                    err_5 = _a.sent();
                    console.error("Google Sheet upload error:", err_5);
                    alert("Failed to import Google Sheet.");
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    });
}
function downloadCSV(userId) {
    var file = userCSVs.get(userId);
    if (!file) {
        alert("No CSV uploaded yet.");
        return;
    }
    var url = URL.createObjectURL(file);
    var a = document.createElement("a");
    a.href = url;
    a.download = "".concat(userId, ".csv");
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}
function deleteCSV(userId) {
    if (userCSVs.has(userId)) {
        userCSVs.delete(userId);
        alert("CSV deleted for user ".concat(userId));
    }
    else {
        alert("No CSV to delete.");
    }
}
// Event Delegation Setup
document.addEventListener("change", function (e) {
    var _a;
    var target = e.target;
    if (target.classList.contains("file-upload") && ((_a = target.files) === null || _a === void 0 ? void 0 : _a[0])) {
        var userId = target.dataset.userid;
        uploadSpreadsheet(e, userId);
    }
});
document.addEventListener("click", function (e) {
    var target = e.target;
    if (target.classList.contains("google-sheet-upload")) {
        var userId = target.dataset.userid;
        var row = target.closest("tr");
        var urlInput = row === null || row === void 0 ? void 0 : row.querySelector(".google-sheet-url");
        var sheetUrl = urlInput.value;
        uploadGoogleSheet(sheetUrl, userId);
    }
    if (target.classList.contains("download-btn")) {
        var userId = target.dataset.userid;
        downloadCSV(userId);
    }
    if (target.classList.contains("delete-btn")) {
        var userId = target.dataset.userid;
        deleteCSV(userId);
    }
});
// Initial Fetch
fetchUsers();
