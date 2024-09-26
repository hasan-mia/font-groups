<?php
require_once 'config/Database.php';

class Migration {
    private $conn;

    public function __construct($db) {
        $this->conn = $db;
    }

    public function createFontsTable() {
        $query = "CREATE TABLE IF NOT EXISTS fonts (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    name VARCHAR(255) NOT NULL,
                    path VARCHAR(255) NOT NULL,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
                  )";

        $stmt = $this->conn->prepare($query);
        if ($stmt->execute()) {
            echo "Table `fonts` created successfully.\n";
        } else {
            echo "Error creating table `fonts`.\n";
        }
    }

    public function createFontGroupsTable() {
        $query = "CREATE TABLE IF NOT EXISTS font_groups (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    name VARCHAR(255) NOT NULL,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
                  )";

        $stmt = $this->conn->prepare($query);
        if ($stmt->execute()) {
            echo "Table `font_groups` created successfully.\n";
        } else {
            echo "Error creating table `font_groups`.\n";
        }
    }

    public function createFontGroupItemsTable() {
        $query = "CREATE TABLE IF NOT EXISTS font_group_items (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    group_id INT,
                    font_id INT,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                    FOREIGN KEY (group_id) REFERENCES font_groups(id) ON DELETE CASCADE,
                    FOREIGN KEY (font_id) REFERENCES fonts(id) ON DELETE CASCADE
                  )";

        $stmt = $this->conn->prepare($query);
        if ($stmt->execute()) {
            echo "Table `font_group_items` created successfully.\n";
        } else {
            echo "Error creating table `font_group_items`.\n";
        }
    }
}

class MigrationManager {
    private $migrations;

    public function __construct($db) {
        $migration = new Migration($db);
        $this->migrations = [
            [$migration, 'createFontsTable'],
            [$migration, 'createFontGroupsTable'],
            [$migration, 'createFontGroupItemsTable'],
        ];
    }

    public function run() {
        foreach ($this->migrations as $migration) {
            call_user_func($migration);
        }
    }
}

// Initialize database
$db = new Database();
$conn = $db->getConnection();

// Run the migrations
$migrationManager = new MigrationManager($conn);
$migrationManager->run();
