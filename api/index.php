<?php

//declare(strict_types=1);

spl_autoload_register(function ($class) {
    require __DIR__ . "/src/$class.php";
});

// set_error_handler("ErrorHandler::handleError");
// set_exception_handler("ErrorHandler::handleException");

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Content-type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, PUT, POST, PATCH, DELETE, HEAD");


//$parts = explode("/", $_SERVER["REQUEST_URI"]);
$database = new Database("localhost", "admin_console", "penziontop4fancz", "heslo");
$class = null;
$action = null;
$id = null;

$gateway = null;
$controller = null;

if (isset($_GET["class"])) {
    $class = $_GET["class"];
}

if (isset($_GET["action"])) {
    $action = $_GET["action"];
}

if (isset($_GET["id"])) {
    $id = $_GET["id"];
}



switch ($class) {
    case 'products':
        $gateway = new ProductGateway($database);
        $controller = new ProductController($gateway);

        $controller->processRequest($_SERVER["REQUEST_METHOD"], $id);
        break;
    case 'admin':
        $gateway = new AdminGateway($database);
        $controller = new AdminController($gateway);

        $controller->processRequest($action, $id);
        break;
    case 'test':
        $conn = $database->getConnection();
        $data = json_decode(file_get_contents("php://input"), true);

        $sql = "INSERT INTO users (username, password, privilege) VALUES (:username, :password, :privilege)";
        $stmt = $conn->prepare($sql);

        $stmt->bindValue(":username", $data["username"], PDO::PARAM_STR);
        $stmt->bindValue(":password", $data["password"], PDO::PARAM_STR);
        $stmt->bindValue(":privilege", 666, PDO::PARAM_STR);

        $stmt->execute();

        http_response_code(201);
        echo json_encode([
            "message" => "User created"
        ]);

        break;
    default:
        //http_response_code(404);
        break;
}
