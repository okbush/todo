let userId = null;

function signup() {
    fetch("http://localhost/todo_app/backend/api/auth.php?action=signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            username: document.getElementById("username").value,
            password: document.getElementById("password").value
        })
    })
    .then(res => res.json())
    .then(data => {
        alert(data.message);
        if (data.message === "User registered successfully") {
            document.getElementById("username").value = "";
            document.getElementById("password").value = "";
        }
    })
    .catch(error => console.error("Signup Error:", error));
}

function signin() {
    fetch("http://localhost/todo_app/backend/api/auth.php?action=signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            username: document.getElementById("username").value,
            password: document.getElementById("password").value
        })
    })
    .then(res => res.json())
    .then(data => {
        if (data.user_id) {
            userId = data.user_id;
            document.getElementById("auth").style.display = "none";
            document.getElementById("todo-section").style.display = "block";
            fetchTasks();
        } else {
            alert("Invalid username or password");
        }
    })
    .catch(error => console.error("Signin Error:", error));
}

function addTask() {
    if (!userId) {
        alert("You must be signed in to add tasks.");
        return;
    }

    fetch("http://localhost/todo_app/backend/api/tasks.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId, task: document.getElementById("task").value })
    })
    .then(res => res.json())
    .then(data => {
        alert(data.message);
        document.getElementById("task").value = "";
        fetchTasks();
    })
    .catch(error => console.error("Error adding task:", error));
}

function fetchTasks() {
    if (!userId) {
        console.error("User ID is missing, cannot fetch tasks.");
        return;
    }

    fetch(`http://localhost/todo_app/backend/api/tasks.php?user_id=${userId}`)
    .then(res => res.json())
    .then(data => {
        let taskList = document.getElementById("task-list");
        taskList.innerHTML = "";

        if (data.error) {
            console.error("Fetch error:", data.error);
            return;
        }

        data.forEach(task => {
            let listItem = document.createElement("li");
            listItem.innerText = `${task.task} - ${task.status}`;
            
            // Create a button to mark as completed
            let completeBtn = document.createElement("button");
            completeBtn.innerText = "✔";
            completeBtn.onclick = () => updateTaskStatus(task.id, "completed");

            // Create a button to delete task
            let deleteBtn = document.createElement("button");
            deleteBtn.innerText = "❌";
            deleteBtn.onclick = () => deleteTask(task.id);

            listItem.appendChild(completeBtn);
            listItem.appendChild(deleteBtn);
            taskList.appendChild(listItem);
        });
    })
    .catch(error => console.error("Error fetching tasks:", error));
}

function updateTaskStatus(taskId, status) {
    fetch("http://localhost/todo_app/backend/api/tasks.php", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: taskId, status })
    })
    .then(res => res.json())
    .then(data => {
        alert(data.message);
        fetchTasks();
    })
    .catch(error => console.error("Error updating task:", error));
}

function deleteTask(taskId) {
    fetch(`http://localhost/todo_app/backend/api/tasks.php?id=${taskId}`, {
        method: "DELETE"
    })
    .then(res => res.json())
    .then(data => {
        alert(data.message);
        fetchTasks();
    })
    .catch(error => console.error("Error deleting task:", error));
}