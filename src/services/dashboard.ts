const API_BASE = "https://wedding-rsvp-admin.onrender.com/api";
const token = localStorage.getItem("token");

if (!token) window.location.href = "/login.html";

const userCSVs = new Map<string, File>();

async function fetchUsers() {
    try {
        const res = await fetch(`${API_BASE}/users`, {
            headers: { Authorization: `Bearer ${token}` }
        });

        if (!res.ok) {
            const errorMsg = await res.text();
            throw new Error(`API error: ${res.status} - ${errorMsg}`);
        }

        const users = await res.json();

        if (!Array.isArray(users)) {
            throw new TypeError("Expected users to be an array");
        }

        renderUsers(users);
    } catch (err) {
        console.error("Failed to fetch users", err);
    }
}

function renderUsers(users) {
    const tbody = document.querySelector("#userTable tbody");
    tbody.innerHTML = "";

    users.forEach(user => {
        if (!user) return;

        const tr = document.createElement("tr");
        const statusClass = user.isActive ? "active" : "inactive";
        const statusText = user.isActive ? "Active" : "Inactive";

        tr.innerHTML = `
            <td>${user.firstName || ""}</td>
            <td>${user.lastName || ""}</td>
            <td>${user.email || ""}</td>
            <td class="status ${statusClass}">${statusText}</td>
            <td>
                <div>
                    <label>Upload CSV or Excel</label><br/>
                    <input type="file" data-userid="${user._id}" class="file-upload" /><br/><br/>

                    <label>Import from Google Sheet</label><br/>
                    <input type="text" placeholder="Paste Google Sheet link" class="google-sheet-url" />
                    <button data-userid="${user._id}" class="google-sheet-upload">Import</button><br/><br/>

                    <button class="icon-btn download-btn" data-userid="${user._id}">📥</button>
                    <button class="icon-btn delete-btn" data-userid="${user._id}">🗑️</button>
                </div>
            </td>
        `;

        tbody.appendChild(tr);
    });
}

async function toggleStatus(userId: string, isActive: boolean) {
    try {
        await fetch(`${API_BASE}/users/${userId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ isActive })
        });
        await fetchUsers();
    } catch (err) {
        console.error("Failed to update status", err);
    }
}

async function deleteUser(userId: string) {
    if (!confirm("Are you sure you want to delete this user?")) return;
    try {
        await fetch(`${API_BASE}/users/${userId}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` }
        });
        await fetchUsers();
    } catch (err) {
        console.error("Failed to delete user", err);
    }
}

function logout() {
    localStorage.removeItem("token");
    window.location.href = "/login.html";
}

async function uploadSpreadsheet(event: Event, userId: string) {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files[0]) {
        const file = input.files[0];

        const allowedTypes = [
            "text/csv",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        ];
        const allowedExtensions = [".csv", ".xlsx"];

        const isMimeValid = allowedTypes.includes(file.type);
        const isExtensionValid = allowedExtensions.some(ext => file.name.toLowerCase().endsWith(ext));

        if (!isMimeValid && !isExtensionValid) {
            alert("Only .csv and .xlsx files are supported.");
            return;
        }

        const formData = new FormData();
        formData.append("csv", file);

        try {
            const res = await fetch(`${API_BASE}/users/${userId}/upload`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`
                },
                body: formData
            });

            if (!res.ok) throw new Error("Upload failed");

            userCSVs.set(userId, file); // ✅ Track uploaded file
            alert(`File '${file.name}' uploaded successfully.`);
        } catch (err) {
            console.error("File upload failed:", err);
            alert("Failed to upload file.");
        }
    }
}

async function uploadGoogleSheet(sheetUrl: string, userId: string) {
    if (!sheetUrl.includes("docs.google.com/spreadsheets")) {
        alert("Please enter a valid Google Sheet URL.");
        return;
    }

    try {
        const res = await fetch(`${API_BASE}/users/${userId}/upload-from-google`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ sheetUrl })
        });

        if (!res.ok) throw new Error("Google Sheet upload failed");

        const data = await res.json();
        alert(`Google Sheet imported successfully with ${data.rows} rows.`);
    } catch (err) {
        console.error("Google Sheet upload error:", err);
        alert("Failed to import Google Sheet.");
    }
}

function downloadCSV(userId: string) {
    const file = userCSVs.get(userId);
    if (!file) {
        alert("No CSV uploaded yet.");
        return;
    }

    const url = URL.createObjectURL(file);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${userId}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function deleteCSV(userId: string) {
    if (userCSVs.has(userId)) {
        userCSVs.delete(userId);
        alert(`CSV deleted for user ${userId}`);
    } else {
        alert("No CSV to delete.");
    }
}

// Event Delegation Setup
document.addEventListener("change", function (e) {
    const target = e.target as HTMLInputElement;
    if (target.classList.contains("file-upload") && target.files?.[0]) {
        const userId = target.dataset.userid!;
        uploadSpreadsheet(e, userId);
    }
});

document.addEventListener("click", function (e) {
    const target = e.target as HTMLElement;

    if (target.classList.contains("google-sheet-upload")) {
        const userId = target.dataset.userid!;
        const row = target.closest("tr");
        const urlInput = row?.querySelector(".google-sheet-url") as HTMLInputElement;
        const sheetUrl = urlInput.value;
        uploadGoogleSheet(sheetUrl, userId);
    }

    if (target.classList.contains("download-btn")) {
        const userId = target.dataset.userid!;
        downloadCSV(userId);
    }

    if (target.classList.contains("delete-btn")) {
        const userId = target.dataset.userid!;
        deleteCSV(userId);
    }
});

// Initial Fetch
fetchUsers();
