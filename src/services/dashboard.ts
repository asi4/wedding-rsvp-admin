const API_BASE = "https://wedding-rsvp-admin.onrender.com/api";
const token = localStorage.getItem("token");

if (!token) window.location.href = "/login.html";

async function fetchUsers() {
    try {
        const res = await fetch(`${API_BASE}/users`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        const users = await res.json();
        renderUsers(users);
    } catch (err) {
        console.error("Failed to fetch users", err);
    }
}

function renderUsers(users) {
    const tbody = document.querySelector("#userTable tbody");
    tbody.innerHTML = "";

    users.forEach(user => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
  <td>${user.firstName}</td>
  <td>${user.lastName}</td>
  <td>${user.email}</td>
  <td class="status ${user.isActive ? 'active' : 'inactive'}">
    ${user.isActive ? 'Active' : 'Inactive'}
  </td>
    <input type="file" accept=".csv" onchange="uploadCSV(event, '${user._id}')" />
    <button class="icon-btn" onclick="downloadCSV('${user._id}')">📥</button>
    <button class="icon-btn" onclick="deleteCSV('${user._id}')">🗑️</button>
    </td>
  </td>
`;
        tbody.appendChild(tr);
    });
}

async function toggleStatus(userId, isActive) {
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

async function deleteUser(userId) {
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

const userCSVs = new Map<string, File>();

async function uploadCSV(event: Event, userId: string) {
    const input: HTMLInputElement = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
        const file = input.files[0];
        if (file.type !== "text/csv") {
            alert("Only .csv files are allowed.");
            return;
        }

        const formData: FormData = new FormData();
        formData.append("csv", file);

        try {
            const res: Response = await fetch(`${API_BASE}/users/${userId}/csv`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`
                },
                body: formData
            });

            if (!res.ok) throw new Error("Upload failed");

            alert("CSV uploaded successfully.");
        } catch (err) {
            console.error("CSV upload failed", err);
            alert("Failed to upload CSV.");
        }
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

fetchUsers();