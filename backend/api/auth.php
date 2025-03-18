<?php
include "db.php";
header("Content-Type: application/json");

$data = json_decode(file_get_contents("php://input"));

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    if ($_GET['action'] == 'signup') {
        $username = $data->username;
        $password = password_hash($data->password, PASSWORD_DEFAULT);

        $stmt = $conn->prepare("INSERT INTO users (username, password) VALUES (?, ?)");
        $stmt->execute([$username, $password]);

        echo json_encode(["message" => "User registered successfully"]);
    } elseif ($_GET['action'] == 'signin') {
        $username = $data->username;
        $password = $data->password;

        $stmt = $conn->prepare("SELECT * FROM users WHERE username = ?");
        $stmt->execute([$username]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($user && password_verify($password, $user['password'])) {
            echo json_encode(["message" => "Login successful", "user_id" => $user['id']]);
        } else {
            echo json_encode(["message" => "Invalid credentials"]);
        }
    }
}
?>
