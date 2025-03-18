<?php
include "db.php";
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(200);
    exit;
}

$data = json_decode(file_get_contents("php://input"));

if (!isset($_GET['action'])) {
    echo json_encode(["error" => "Missing action parameter"]);
    exit;
}

$action = $_GET['action'];

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    if ($action === 'signup') {
        if (!isset($data->username, $data->password)) {
            echo json_encode(["error" => "Missing username or password"]);
            exit;
        }

        $username = $data->username;
        $password = password_hash($data->password, PASSWORD_DEFAULT);

        $stmt = $conn->prepare("SELECT id FROM users WHERE username = ?");
        $stmt->execute([$username]);
        if ($stmt->fetch()) {
            echo json_encode(["error" => "Username already taken"]);
            exit;
        }

        // Insert new user
        $stmt = $conn->prepare("INSERT INTO users (username, password) VALUES (?, ?)");
        if ($stmt->execute([$username, $password])) {
            echo json_encode(["message" => "User registered successfully"]);
        } else {
            echo json_encode(["error" => "Failed to register user"]);
        }
    } elseif ($action === 'signin') {
        if (!isset($data->username, $data->password)) {
            echo json_encode(["error" => "Missing username or password"]);
            exit;
        }

        $username = $data->username;
        $password = $data->password;

        $stmt = $conn->prepare("SELECT * FROM users WHERE username = ?");
        $stmt->execute([$username]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($user && password_verify($password, $user['password'])) {
            echo json_encode(["message" => "Login successful", "user_id" => $user['id']]);
        } else {
            echo json_encode(["error" => "Invalid credentials"]);
        }
    } else {
        echo json_encode(["error" => "Invalid action"]);
    }
} else {
    echo json_encode(["error" => "Invalid request method"]);
}
?>
