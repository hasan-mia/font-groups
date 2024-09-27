<?php
require_once 'models/Font.php';

class FontApi {
    private $font;

    public function __construct($db) {
        $this->font = new Font($db);
    }

    public function handleRequest($method, $id = null) {
        switch ($method) {
            case 'GET':
                $this->getFonts();
                break;
            case 'POST':
                $this->createFont();
                break;
            case 'DELETE':
                $this->deleteFont($id);
                break;
            default:
                http_response_code(405);
                echo json_encode(['error' => 'Method not allowed']);
        }
    }

    private function getFonts() {
        $page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
        $per_page = isset($_GET['per_page']) ? (int)$_GET['per_page'] : 10;
        
        // Call the read method with pagination parameters
        $result = $this->font->read($page, $per_page);

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

    private function createFont() {
        $data = json_decode(file_get_contents("php://input"));
        
        // Validate input data
        if (!empty($data->name) && !empty($data->path) && !empty($data->size)) {
            // Assign values to the font object
            $this->font->name = $data->name;
            $this->font->path = $data->path;
            $this->font->size = $data->size;

            // Call the create method
            $fontRecord = $this->font->create();
            
            if ($fontRecord) {
                http_response_code(201);
                echo json_encode( $fontRecord);
            } else {
                http_response_code(503);
                echo json_encode(['message' => 'Unable to create font']);
            }
        } else {
            http_response_code(400);
            echo json_encode(['message' => 'Incomplete data']);
        }
    }


    private function deleteFont($id) {
        if($id) {
            $this->font->id = $id;
            if($this->font->delete()) {
                echo json_encode(['message' => 'Font deleted']);
            } else {
                http_response_code(503);
                echo json_encode(['message' => 'Unable to delete font']);
            }
        } else {
            http_response_code(400);
            echo json_encode(['message' => 'Font ID required']);
        }
    }
}
