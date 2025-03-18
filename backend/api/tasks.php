<?php
include "db.php";
header("Content-Type: application/json");

$data = json_decode(file_get_contents("php://input"));

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $user_id = $data->user_id;
    $task = $data->task;

    $stmt = $conn->prepare("INSERT INTO tasks (user_id, task) VALUES (?, ?)");
    $stmt->execute([$user_id, $task]);

    echo json_encode(["message" => "Task added"]);
}

if ($_SERVER["REQUEST_METHOD"] == "GET") {
    $stmt = $conn->prepare("SELECT * FROM tasks WHERE user_id = ?");
    $stmt->execute([$_GET['user_id']]);
    echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
}

if ($_SERVER["REQUEST_METHOD"] == "PUT") {
    $task_id = $data->id;
    $status = $data->status;

    $stmt = $conn->prepare("UPDATE tasks SET status = ? WHERE id = ?");
    $stmt->execute([$status, $task_id]);

    echo json_encode(["message" => "Task updated"]);
}

if ($_SERVER["REQUEST_METHOD"] == "DELETE") {
    $task_id = $_GET['id'];

    $stmt = $conn->prepare("DELETE FROM tasks WHERE id = ?");
    $stmt->execute([$task_id]);

    echo json_encode(["message" => "Task deleted"]);
}
?>
