<?php
include "db.php";
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// Handle preflight requests for CORS
if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(200);
    exit;
}

// Read input data (if any)
$data = json_decode(file_get_contents("php://input"));

// Process request based on method
if ($_SERVER["REQUEST_METHOD"] === "POST") {
    if (!isset($data->user_id, $data->task)) {
        echo json_encode(["error" => "Missing user_id or task"]);
        exit;
    }

    $user_id = $data->user_id;
    $task = $data->task;

    $stmt = $conn->prepare("INSERT INTO tasks (user_id, task, status) VALUES (?, ?, 'pending')");
    if ($stmt->execute([$user_id, $task])) {
        echo json_encode(["message" => "Task added"]);
    } else {
        echo json_encode(["error" => "Failed to add task"]);
    }
}

elseif ($_SERVER["REQUEST_METHOD"] === "GET") {
    if (!isset($_GET['user_id'])) {
        echo json_encode(["error" => "Missing user_id"]);
        exit;
    }

    $stmt = $conn->prepare("SELECT * FROM tasks WHERE user_id = ?");
    $stmt->execute([$_GET['user_id']]);
    echo json_encode($stmt->fetchAll());
}

elseif ($_SERVER["REQUEST_METHOD"] === "PUT") {
    if (!isset($data->id, $data->status)) {
        echo json_encode(["error" => "Missing task id or status"]);
        exit;
    }

    $task_id = $data->id;
    $status = $data->status;

    $stmt = $conn->prepare("UPDATE tasks SET status = ? WHERE id = ?");
    if ($stmt->execute([$status, $task_id])) {
        echo json_encode(["message" => "Task updated"]);
    } else {
        echo json_encode(["error" => "Failed to update task"]);
    }
}

elseif ($_SERVER["REQUEST_METHOD"] === "DELETE") {
    if (!isset($_GET['id'])) {
        echo json_encode(["error" => "Missing task id"]);
        exit;
    }

    $task_id = $_GET['id'];

    $stmt = $conn->prepare("DELETE FROM tasks WHERE id = ?");
    if ($stmt->execute([$task_id])) {
        echo json_encode(["message" => "Task deleted"]);
    } else {
        echo json_encode(["error" => "Failed to delete task"]);
    }
}

else {
    echo json_encode(["error" => "Invalid request method"]);
}
?>