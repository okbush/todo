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
        }
    });
}

function addTask() {
    fetch("http://localhost/todo_app/backend/api/tasks.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
            user_id: userId, 
            task: document.getElementById("task").value,
            description: document.getElementById("description").value
        })
    }).then(fetchTasks);
}

function fetchTasks() {
    fetch(`http://localhost/todo_app/backend/api/tasks.php?user_id=${userId}`)
    .then(res => res.json())
    .then(data => {
        const taskList = document.getElementById("task-list");
        taskList.innerHTML = "";
        data.forEach(task => {
            const li = document.createElement("li");
            li.classList.add("task-item");
            li.innerHTML = `
                <div class="task-details">
                    <div class="task-title">${task.task}</div>
                    <div class="task-description">${task.description}</div>
                    <div class="task-status">Status: ${task.status}</div>
                </div>
                <div class="task-actions">
                    <button class="btn-complete" onclick="updateTaskStatus(${task.id}, 'completed')">Done</button>
                    <button class="btn-delete" onclick="deleteTask(${task.id})">Delete</button>
                </div>
            `;
            taskList.appendChild(li);
        });
    })
    .catch(error => console.error("Error fetching tasks:", error));
}

function updateTaskStatus(taskId, status) {
    fetch(`http://localhost/todo_app/backend/api/tasks.php`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: taskId, status })
    }).then(fetchTasks);
}

function deleteTask(taskId) {
    fetch(`http://localhost/todo_app/backend/api/tasks.php?id=${taskId}`, {
        method: "DELETE"
    }).then(fetchTasks);
}
