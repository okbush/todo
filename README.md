1. Open XAMPP and start Apache and MySQL
2. Import todo_app.db or make ur own with the same name
      -To make ur own: Title it todo_app and enter this
        CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
);

CREATE TABLE tasks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    task VARCHAR(255) NOT NULL,
    status ENUM('pending', 'finished') DEFAULT 'pending',
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

3. transfer this code to ur C:\xampp\htdocs folder
4. Enter in browser http://localhost/todo_app/frontend/index.html
