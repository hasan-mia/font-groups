<?php
// Allow CORS and define allowed methods and headers
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// Handle OPTIONS requests for CORS preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once 'config/Database.php';
require_once 'api/fonts.php';
require_once 'api/fontgroups.php';

// Welcome message for base or fontgroups URI
if ($_SERVER['REQUEST_URI'] == '/' || $_SERVER['REQUEST_URI'] == '/font-groups/server/') {
    header('Content-Type: application/json');
    echo json_encode([
        'message' => 'Welcome to the Font Group System API'
    ]);
    exit;
}

$request = $_SERVER['REQUEST_URI'];
$method = $_SERVER['REQUEST_METHOD'];
$path = trim($_SERVER['PATH_INFO'] ?? '', '/');
$segments = explode('/', $path);
$resource = $segments[0] ?? '';
$id = $segments[1] ?? null;

header('Content-Type: application/json');

// Initialize database
$db = new Database();
$conn = $db->getConnection();

// Check if the request is for file upload
if ($path === 'upload' && $method === 'POST') {
    handleFileUpload();
    exit;
}

switch ($resource) {
    case 'fonts':
        $fontApi = new FontApi($conn);
        $fontApi->handleRequest($method, $id); 
        break;
    case 'fontgroups':
        $fontGroupApi = new FontGroupApi($conn);
        $fontGroupApi->handleRequest($method, $id);
        break;
    default:
        http_response_code(404);
        echo json_encode(['error' => 'Resource not found']);
        break;
}

// Handle file upload function
function handleFileUpload() {
    // Check if file is provided
    if (empty($_FILES['file'])) {
        http_response_code(400);
        echo json_encode(["message" => "No file uploaded."]);
        return;
    }

    // Define allowed file types
    $allowedTypes = ['ttf', 'png'];
    $uploadDir = 'public/uploads/';

    // Get the uploaded file information
    $originalFileName = basename($_FILES['file']['name']);
    $fileTmpPath = $_FILES['file']['tmp_name'];
    $fileType = strtolower(pathinfo($originalFileName, PATHINFO_EXTENSION));
    $fileSize = $_FILES['file']['size'];

    // Check if the file type is allowed
    if (!in_array($fileType, $allowedTypes)) {
        http_response_code(400);
        echo json_encode(["message" => "Invalid file type. Only TTF are allowed."]);
        return;
    }

    // Ensure the upload directory exists
    if (!is_dir($uploadDir) && !mkdir($uploadDir, 0777, true)) {
        http_response_code(500);
        echo json_encode(["message" => "Failed to create upload directory."]);
        return;
    }

    // Generate a unique name
    $newFileName = uniqid() . '.' . $fileType;
    $filePath = $uploadDir . $newFileName;

    // Move the uploaded file to the uploads
    if (move_uploaded_file($fileTmpPath, $filePath)) {
        $fileUrl = 'http://' . $_SERVER['HTTP_HOST'] . '/font-groups/server/' . $filePath;
        http_response_code(200);
        $data = [
            "fileUrl" => $fileUrl,
            "originalFileName" => $originalFileName,
            "newFileName" => $newFileName,
            "fileSize" => $fileSize
        ];

        http_response_code(200);

        echo json_encode([
            "message" => "File uploaded successfully.",
            "data" => $data
        ]);
    } else {
        http_response_code(500);
        echo json_encode(["message" => "Failed to move the uploaded file."]);
    }
}
