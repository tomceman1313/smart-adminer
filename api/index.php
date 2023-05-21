<?php
//declare(strict_types=1);

spl_autoload_register(function ($class) {
    require __DIR__ . "/src/$class.php";
});

require __DIR__ . "/src/controllers/AdminController.php";
require __DIR__ . "/src/gateways/AdminGateway.php";

require __DIR__ . "/src/controllers/PricelistController.php";
require __DIR__ . "/src/gateways/PricelistGateway.php";

require __DIR__ . "/src/controllers/NotificationsController.php";
require __DIR__ . "/src/gateways/NotificationsGateway.php";

require __DIR__ . "/src/controllers/ArticlesController.php";
require __DIR__ . "/src/gateways/ArticlesGateway.php";

require __DIR__ . "/src/controllers/GalleryController.php";
require __DIR__ . "/src/gateways/GalleryGateway.php";

require __DIR__ . "/src/controllers/DocumentsController.php";
require __DIR__ . "/src/gateways/DocumentsGateway.php";

require __DIR__ . "/src/controllers/EventsController.php";
require __DIR__ . "/src/gateways/EventsGateway.php";

require __DIR__ . "/src/controllers/ProductsController.php";
require __DIR__ . "/src/gateways/ProductsGateway.php";
require __DIR__ . "/src/gateways/products/ManufacturerGateway.php";
require __DIR__ . "/src/gateways/products/CategoryGateway.php";

//Dev
header("Access-Control-Allow-Origin: http://localhost:3000");
// header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");

// header("Content-type: application/json; charset=UTF-8, multipart/form-data");
// header("Access-Control-Allow-Methods: GET, PUT, POST, PATCH, DELETE, HEAD");

// header("Access-Control-Allow-Credentials: true");

//Production 
//header("Access-Control-Allow-Origin: http://localhost/admin");
header("Content-type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, PUT, POST, PATCH, DELETE, HEAD");

header("Access-Control-Allow-Credentials: true");

header("Access-Control-Allow-Headers: *");



//$parts = explode("/", $_SERVER["REQUEST_URI"]);
$database = new Database("localhost", "admin_console", "penziontop4fancz", "heslo");
//$database = new Database("localhost", "u351850998_dbtest", "u351850998_admin_test", "Tomikz13");
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
$admin = new AdminGateway($database);
switch ($class) {
    case 'products':
        $gateway = new ProductsGateway($database);
        $manufacturer = new ManufacturerGateway($database);
        $category = new CategoryGateway($database);
        $controller = new ProductsController($gateway, $admin, $manufacturer, $category);

        $controller->processRequest($action, $id);
        break;
    case 'admin':
        $gateway = new AdminGateway($database);
        $controller = new AdminController($gateway);

        $controller->processRequest($action, $id);
        break;
    case 'pricelist':
        $gateway = new PricelistGateway($database);
        $controller = new PricelistConroller($gateway, $admin);

        $controller->processRequest($action, $id);
        break;
    case 'notifications':
        $gateway = new NotificationsGateway($database);
        $controller = new NotificationsConroller($gateway, $admin);
        $controller->processRequest($action, $id);
        break;

    case 'articles':
        $gateway = new ArticlesGateway($database);
        $controller = new ArticlesConroller($gateway, $admin);
        $controller->processRequest($action, $id);
        break;
    case 'gallery':
        $gateway = new GalleryGateway($database);
        $controller = new GalleryConroller($gateway, $admin);
        $controller->processRequest($action, $id);
        break;

    case 'documents':
        $gateway = new DocumentsGateway($database);
        $controller = new DocumentsConroller($gateway, $admin);
        $controller->processRequest($action, $id);
        break;
    case 'events':
        $gateway = new EventsGateway($database);
        $controller = new EventsConroller($gateway, $admin);
        $controller->processRequest($action, $id);
        break;
    default:
        http_response_code(404);
        break;
}
