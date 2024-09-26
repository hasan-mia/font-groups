<?php
class FontGroup {
    private $conn;
    private $table_name = "font_groups";
    private $items_table = "font_group_items";

    public $id;
    public $name;
    public $font_ids;

    public function __construct($db) {
        $this->conn = $db;
    }

    // Read all font groups
    public function read($page = 1, $per_page = 10) {
        $start = ($page - 1) * $per_page;

         // Get the total count of records
        $countQuery = "SELECT COUNT(*) as total FROM " . $this->table_name;
        $countStmt = $this->conn->prepare($countQuery);
        $countStmt->execute();
        $totalCount = $countStmt->fetch(PDO::FETCH_ASSOC)['total'];

        $query = "SELECT fg.id, fg.name, GROUP_CONCAT(f.name) as fonts
            FROM " . $this->table_name . " fg
            LEFT JOIN " . $this->items_table . " fgi ON fg.id = fgi.group_id
            LEFT JOIN fonts f ON fgi.font_id = f.id
            GROUP BY fg.id
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

    // Create a font group
    public function create() {
        $this->conn->beginTransaction();

        try {
            // Insert into the font_groups table
            $query = "INSERT INTO " . $this->table_name . " SET name=:name";
            $stmt = $this->conn->prepare($query);
            $this->name = htmlspecialchars(strip_tags($this->name));
            $stmt->bindParam(":name", $this->name);
            $stmt->execute();

            $group_id = $this->conn->lastInsertId();

            // Insert into the font_group_items table for each font_id
            foreach($this->font_ids as $font_id) {
                $query = "INSERT INTO " . $this->items_table . " SET group_id=:group_id, font_id=:font_id";
                $stmt = $this->conn->prepare($query);
                $stmt->bindParam(":group_id", $group_id);
                $stmt->bindParam(":font_id", $font_id);
                $stmt->execute();
            }

            $this->conn->commit();
            return true;

        } catch(Exception $e) {
            $this->conn->rollBack();
            return false;
        }
    }


    // Update a font group
    public function update() {
        $this->conn->beginTransaction();

        try {
            $query = "UPDATE " . $this->table_name . " SET name=:name WHERE id=:id";
            $stmt = $this->conn->prepare($query);
            $this->name = htmlspecialchars(strip_tags($this->name));
            $stmt->bindParam(":name", $this->name);
            $stmt->bindParam(":id", $this->id);
            $stmt->execute();

            $query = "DELETE FROM " . $this->items_table . " WHERE group_id=:group_id";
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(":group_id", $this->id);
            $stmt->execute();

            foreach($this->font_ids as $font_id) {
                $query = "INSERT INTO " . $this->items_table . " SET group_id=:group_id, font_id=:font_id";
                $stmt = $this->conn->prepare($query);
                $stmt->bindParam(":group_id", $this->id);
                $stmt->bindParam(":font_id", $font_id);
                $stmt->execute();
            }

            $this->conn->commit();
            return true;
        } catch(Exception $e) {
            $this->conn->rollBack();
            return false;
        }
    }

    // Delete a font group
    public function delete() {
        $this->conn->beginTransaction();

        try {
            $query = "DELETE FROM " . $this->items_table . " WHERE group_id = ?";
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(1, $this->id);
            $stmt->execute();

            $query = "DELETE FROM " . $this->table_name . " WHERE id = ?";
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(1, $this->id);
            $stmt->execute();

            $this->conn->commit();
            return true;
        } catch(Exception $e) {
            $this->conn->rollBack();
            return false;
        }
    }
}
