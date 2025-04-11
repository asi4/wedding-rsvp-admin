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
  <td>
    ${user.isActive
            ? `<button class="icon-btn" onclick="toggleStatus('${user._id}', false)">
           <i class="fas fa-user-lock deactivate-icon" title="Deactivate"></i>
         </button>`
            : `<button class="icon-btn" onclick="toggleStatus('${user._id}', true)">
           <i class="fas fa-user-check approve-icon" title="Approve"></i>
         </button>`
        }
    <button class="icon-btn" onclick="deleteUser('${user._id}')">
      <i class="fas fa-user-xmark delete-icon" title="Delete"></i>
    </button>
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

fetchUsers();