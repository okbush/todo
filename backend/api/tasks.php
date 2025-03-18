<?php
include "db.php";
header("Content-Type: application/json");

$data = json_decode(file_get_contents("php://input"));

// ✅ Create a new task (POST)
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $user_id = $data->user_id;
    $task = $data->task;
    $description = $data->description;

    $stmt = $conn->prepare("INSERT INTO tasks (user_id, task, description, status) VALUES (?, ?, ?, 'pending')");
    $stmt->execute([$user_id, $task, $description]);

    echo json_encode(["message" => "Task added successfully"]);
}

// ✅ Fetch tasks (GET)
if ($_SERVER["REQUEST_METHOD"] == "GET" && isset($_GET['user_id'])) {
    $stmt = $conn->prepare("SELECT * FROM tasks WHERE user_id = ?");
    $stmt->execute([$_GET['user_id']]);
    echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
}

// ✅ Update task status (PUT)
if ($_SERVER["REQUEST_METHOD"] == "PUT") {
    parse_str(file_get_contents("php://input"), $_PUT);
    $task_id = $_PUT['id'];
    $status = $_PUT['status'];

    $stmt = $conn->prepare("UPDATE tasks SET status = ? WHERE id = ?");
    $stmt->execute([$status, $task_id]);

    echo json_encode(["message" => "Task updated successfully"]);
}

// ✅ Delete a task (DELETE)
if ($_SERVER["REQUEST_METHOD"] == "DELETE" && isset($_GET['id'])) {
    $task_id = $_GET['id'];

    $stmt = $conn->prepare("DELETE FROM tasks WHERE id = ?");
    $stmt->execute([$task_id]);

    echo json_encode(["message" => "Task deleted successfully"]);
}
?>