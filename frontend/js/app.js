let userId = null;

function signup() {
    fetch("backend/api/auth.php?action=signup", {
        method: "POST",
        body: JSON.stringify({
            username: document.getElementById("username").value,
            password: document.getElementById("password").value
        })
    }).then(res => res.json()).then(console.log);
}

function signin() {
    fetch("backend/api/auth.php?action=signin", {
        method: "POST",
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
    fetch("backend/api/tasks.php", {
        method: "POST",
        body: JSON.stringify({ user_id: userId, task: document.getElementById("task").value })
    }).then(fetchTasks);
}

function fetchTasks() {
    fetch(`backend/api/tasks.php?user_id=${userId}`)
    .then(res => res.json())
    .then(data => console.log(data));
}
