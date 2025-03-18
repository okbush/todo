let userId = null;

function signup() {
    fetch("http://localhost/todo_app/backend/api/auth.php?action=signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            username: document.getElementById("username").value,
            password: document.getElementById("password").value
        })
    }).then(res => res.json()).then(console.log);
}

function signin() {
    fetch("http://localhost/todo_app/backend/api/auth.php?action=signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            username: document.getElementById("username").value,
            password: document.getElementById("password").value
        })
    }).then(res => res.json()).then(data => {
        if (data.user_id) {
            userId = data.user_id;
            document.getElementById("auth").style.display = "none";
            document.getElementById("todo-section").style.display = "block";
            fetchTasks();
        } else {
            document.getElementById("auth-message").innerText = "Invalid credentials";
        }
    });
}

function addTask() {
    const taskTitle = document.getElementById("task").value;
    const taskDescription = document.getElementById("description").value;

    if (!taskTitle || !taskDescription) {
        alert("Please fill in both fields!");
        return;
    }

    fetch("http://localhost/todo_app/backend/api/tasks.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId, task: taskTitle, description: taskDescription })
    }).then(res => res.json()).then(() => {
        document.getElementById("task").value = "";
        document.getElementById("description").value = "";
        fetchTasks();
    });
}

function fetchTasks() {
    fetch(`http://localhost/todo_app/backend/api/tasks.php?user_id=${userId}`)
    .then(res => res.json())
    .then(data => {
        const taskList = document.getElementById("task-list");
        taskList.innerHTML = "";

        data.forEach(task => {
            const li = document.createElement("li");
            li.innerHTML = `
                <div>
                    <strong>${task.task}</strong> <br>
                    <small>${task.description}</small> <br>
                    <span>Status: <b>${task.status}</b></span>
                </div>
                <button onclick="toggleTaskStatus(${task.id}, '${task.status}')">
                    ${task.status === "done" ? "Undo" : "Mark as Done"}
                </button>
                <button onclick="deleteTask(${task.id})">❌</button>
            `;
            taskList.appendChild(li);
        });
    })
    .catch(error => console.error("Error fetching tasks:", error));
}

function toggleTaskStatus(taskId, currentStatus) {
    const newStatus = currentStatus === "done" ? "pending" : "done";

    fetch(`http://localhost/todo_app/backend/api/tasks.php`, {
        method: "PUT",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `id=${taskId}&status=${newStatus}`
    }).then(() => fetchTasks());
}

function deleteTask(taskId) {
    fetch(`http://localhost/todo_app/backend/api/tasks.php?id=${taskId}`, {
        method: "DELETE"
    }).then(fetchTasks);
}

function logout() {
    userId = null;
    document.getElementById("auth").style.display = "block";
    document.getElementById("todo-section").style.display = "none";
    document.getElementById("auth-message").innerText = "You have logged out.";
}