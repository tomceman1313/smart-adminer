<?php

//declare(strict_types=1);

spl_autoload_register(function ($class) {
    require __DIR__ . "/src/$class.php";
});

require __DIR__ . "/src/controllers/AdminController.php";
require __DIR__ . "/src/gateways/AdminGateway.php";

require __DIR__ . "/src/controllers/ProductController.php";
require __DIR__ . "/src/gateways/ProductGateway.php";

require __DIR__ . "/src/controllers/PricelistController.php";
require __DIR__ . "/src/gateways/PricelistGateway.php";

require __DIR__ . "/src/controllers/NotificationsController.php";
require __DIR__ . "/src/gateways/NotificationsGateway.php";

require __DIR__ . "/src/controllers/ArticlesController.php";
require __DIR__ . "/src/gateways/ArticlesGateway.php";

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
    case 'pricelist':
        $gateway = new PricelistGateway($database);
        $controller = new PricelistConroller($gateway);

        $controller->processRequest($action, $id);
        break;
    case 'notifications':
        $gateway = new NotificationsGateway($database);
        $controller = new NotificationsConroller($gateway);

        $controller->processRequest($action, $id);

    case 'articles':
        $gateway = new ArticlesGateway($database);
        $controller = new ArticlesConroller($gateway);

        $controller->processRequest($action, $id);
    default:
        //http_response_code(404);
        break;
}
