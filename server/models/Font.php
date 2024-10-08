<?php
class Font {
    private $conn;
    private $table_name = "fonts";

    public $id;
    public $name;
    public $path;
    public $size;

    public function __construct($db) {
        $this->conn = $db;
    }

    // Read all fonts
    public function read($page = 1, $per_page = 10) {
        $start = ($page - 1) * $per_page;

        // Get the total count of records
        $countQuery = "SELECT COUNT(*) as total FROM " . $this->table_name;
        $countStmt = $this->conn->prepare($countQuery);
        $countStmt->execute();
        $totalCount = $countStmt->fetch(PDO::FETCH_ASSOC)['total'];

        $query = "SELECT id, name, path, size, created_at, updated_at
                FROM " . $this->table_name . "
                ORDER BY created_at DESC
                LIMIT :start, :per_page";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':start', $start, PDO::PARAM_INT);
        $stmt->bindParam(':per_page', $per_page, PDO::PARAM_INT);
        $stmt->execute();

        return [
            'data' => $stmt->fetchAll(PDO::FETCH_ASSOC),
            'total' => $totalCount
        ];
    }


    // Create a font
    public function create() {
        $query = "INSERT INTO " . $this->table_name . " SET name=:name, path=:path, size=:size, created_at=CURRENT_TIMESTAMP, updated_at=CURRENT_TIMESTAMP";
        $stmt = $this->conn->prepare($query);

        $this->name = htmlspecialchars(strip_tags($this->name));
        $this->path = htmlspecialchars(strip_tags($this->path));
        $this->size = htmlspecialchars(strip_tags($this->size));

        $stmt->bindParam(":name", $this->name);
        $stmt->bindParam(":path", $this->path);
        $stmt->bindParam(":size", $this->size);

        if ($stmt->execute()) {
            // Get the last inserted ID
            $insertedId = $this->conn->lastInsertId();

            $fetchQuery = "SELECT * FROM " . $this->table_name . " WHERE id = :id";
            $fetchStmt = $this->conn->prepare($fetchQuery);
            $fetchStmt->bindParam(":id", $insertedId);
            $fetchStmt->execute();
            
            // Fetch the record
            $record = $fetchStmt->fetch(PDO::FETCH_ASSOC);

            return [
                "message" => "Font create successfully.",
                "data" => $record
            ];
        }

        return [
            "message" => "Failed to upload font.",
            "data" => null
        ];
    }

    // Delete a font
    public function delete() {
        $query = "DELETE FROM " . $this->table_name . " WHERE id = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $this->id);

        if($stmt->execute()) {
            return true;
        }
        return false;
    }
}
