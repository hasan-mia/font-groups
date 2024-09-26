<?php
require_once 'models/FontGroup.php';

class FontGroupApi {
    private $fontGroup;

    public function __construct($db) {
        $this->fontGroup = new FontGroup($db);
    }

    public function handleRequest($method, $id = null) {
        switch ($method) {
            case 'GET':
                $this->getFontGroups();
                break;
            case 'POST':
                $this->createFontGroup();
                break;
            case 'PUT':
                $this->updateFontGroup($id);
                break;
            case 'DELETE':
                $this->deleteFontGroup($id);
                break;
            default:
                http_response_code(405);
                echo json_encode(['error' => 'Method not allowed']);
        }
    }

    private function getFontGroups() {
        $page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
        $per_page = isset($_GET['per_page']) ? (int)$_GET['per_page'] : 10;

        $result = $this->fontGroup->read($page, $per_page);

         // Fetch fonts data
        $fonts = $result['data'];
        $totalRecords = $result['total'];

        // Calculate total pages
        $totalPages = ceil($totalRecords / $per_page);

        // Prepare the response
        $response = [
            'current_page' => $page,
            'total_pages' => $totalPages,
            'total' => $totalRecords,
            'data' => $fonts
        ];

        // Return the results as JSON
        header('Content-Type: application/json');
        echo json_encode($response);

    }
    
    private function createFontGroup() {
        $data = json_decode(file_get_contents("php://input"));
        if(!empty($data->name) && !empty($data->font_ids)) {
            $this->fontGroup->name = $data->name;
            $this->fontGroup->font_ids = $data->font_ids;
            if($this->fontGroup->create()) {
                http_response_code(201);
                echo json_encode(['message' => 'Font group created']);
            } else {
                http_response_code(503);
                echo json_encode(['message' => 'Unable to create font group']);
            }
        } else {
            http_response_code(400);
            echo json_encode(['message' => 'Incomplete data']);
        }
    }

    private function updateFontGroup($id) {
        $data = json_decode(file_get_contents("php://input"));
        if(!empty($id) && !empty($data->name) && !empty($data->font_ids)) {
            $this->fontGroup->id = $id;
            $this->fontGroup->name = $data->name;
            $this->fontGroup->font_ids = $data->font_ids;
            if($this->fontGroup->update()) {
                echo json_encode(['message' => 'Font group updated']);
            } else {
                http_response_code(503);
                echo json_encode(['message' => 'Unable to update font group']);
            }
        } else {
            http_response_code(400);
            echo json_encode(['message' => 'Incomplete data']);
        }
    }

    private function deleteFontGroup($id) {
        if($id) {
            $this->fontGroup->id = $id;
            if($this->fontGroup->delete()) {
                echo json_encode(['message' => 'Font group deleted']);
            } else {
                http_response_code(503);
                echo json_encode(['message' => 'Unable to delete font group']);
            }
        } else {
            http_response_code(400);
            echo json_encode(['message' => 'Font group ID required']);
        }
    }
}
