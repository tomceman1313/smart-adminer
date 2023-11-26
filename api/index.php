<?php
//declare(strict_types=1);

// spl_autoload_register(function ($class) {
//     require __DIR__ . "/src/$class.php";
// });

require_once __DIR__ . "/src/Database.php";
require_once __DIR__ . "/src/ErrorHandler.php";
require_once __DIR__ . "/src/publicFolderPath.php";

require_once __DIR__ . "/src/controllers/AdminController.php";
require_once __DIR__ . "/src/gateways/AdminGateway.php";

require_once __DIR__ . "/src/controllers/PricelistController.php";
require_once __DIR__ . "/src/gateways/PricelistGateway.php";

require_once __DIR__ . "/src/controllers/NotificationsController.php";
require_once __DIR__ . "/src/gateways/NotificationsGateway.php";

require_once __DIR__ . "/src/controllers/ArticlesController.php";
require_once __DIR__ . "/src/gateways/ArticlesGateway.php";

require_once __DIR__ . "/src/controllers/GalleryController.php";
require_once __DIR__ . "/src/gateways/GalleryGateway.php";

require_once __DIR__ . "/src/controllers/DocumentsController.php";
require_once __DIR__ . "/src/gateways/DocumentsGateway.php";

require_once __DIR__ . "/src/controllers/EventsController.php";
require_once __DIR__ . "/src/gateways/EventsGateway.php";

require_once __DIR__ . "/src/controllers/ProductsController.php";
require_once __DIR__ . "/src/gateways/ProductsGateway.php";
require_once __DIR__ . "/src/gateways/products/ManufacturerGateway.php";
require_once __DIR__ . "/src/gateways/products/CategoryGateway.php";

require_once __DIR__ . "/src/controllers/VacancyController.php";
require_once __DIR__ . "/src/gateways/VacancyGateway.php";

require_once __DIR__ . "/src/controllers/EmployeesController.php";
require_once __DIR__ . "/src/gateways/EmployeesGateway.php";

require_once __DIR__ . "/src/controllers/OrdersController.php";
require_once __DIR__ . "/src/gateways/orders/OrdersGateway.php";

require_once __DIR__ . "/src/controllers/EmailsController.php";
require_once __DIR__ . "/src/gateways/emails/EmailsGateway.php";

require_once __DIR__ . "/src/controllers/PagesController.php";
require_once __DIR__ . "/src/gateways/pages/PagesGateway.php";

//Dev
header("Access-Control-Allow-Origin: http://localhost:3000");

//Production 
//header("Access-Control-Allow-Origin: http://localhost");
header("Content-type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, PUT, POST, PATCH, DELETE, HEAD, OPTIONS");

header("Access-Control-Allow-Credentials: true");

header("Access-Control-Allow-Headers: Origin, X-Api-Key, X-Requested-With, Content-Type, Accept, Authorization");

//preflight check for auth requests
$method = $_SERVER['REQUEST_METHOD'];
if ($method == "OPTIONS") {
    header("Access-Control-Allow-Origin: http://localhost:3000");
    header("Access-Control-Allow-Headers: X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method,Access-Control-Request-Headers, Authorization");
    header("HTTP/1.1 200 OK");
    die();
}

//$parts = explode("/", $_SERVER["REQUEST_URI"]);
$database = new Database("localhost", "admin_console", "penziontop4fancz", "heslo");

//production
//$database = new Database("localhost", "u351850998_cms", "u351850998_tomas", "Tomikz13");
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
        $controller = new PricelistController($gateway, $admin);

        $controller->processRequest($action, $id);
        break;
    case 'notifications':
        $gateway = new NotificationsGateway($database);
        $controller = new NotificationsController($gateway, $admin);
        $controller->processRequest($action, $id);
        break;

    case 'articles':
        $gateway = new ArticlesGateway($database);
        $controller = new ArticlesController($gateway, $admin);
        $controller->processRequest($action, $id);
        break;
    case 'gallery':
        $gateway = new GalleryGateway($database);
        $controller = new GalleryController($gateway, $admin);
        $controller->processRequest($action, $id);
        break;

    case 'documents':
        $gateway = new DocumentsGateway($database);
        $controller = new DocumentsController($gateway, $admin);
        $controller->processRequest($action, $id);
        break;
    case 'events':
        $gateway = new EventsGateway($database);
        $controller = new EventsController($gateway, $admin);
        $controller->processRequest($action, $id);
        break;

    case 'vacancies':
        $gateway = new VacancyGateway($database);
        $controller = new VacancyController($gateway, $admin);
        $controller->processRequest($action, $id);
        break;
    case 'employees':
        $gateway = new EmployeesGateway($database);
        $controller = new EmployeesController($gateway, $admin);
        $controller->processRequest($action, $id);
        break;
    case 'orders':
        $gateway = new OrdersGateway($database);
        $controller = new OrdersController($admin, $gateway);
        $controller->processRequest($action, $id);
        break;
    case 'emails':
        $gateway = new EmailsGateway($database);
        $controller = new EmailsController($admin, $gateway);
        $controller->processRequest($action, $id);
        break;
    case 'pages':
        $gateway = new PagesGateway($database);
        $controller = new PagesController($gateway, $admin);
        $controller->processRequest($action, $id);
        break;
    default:
        http_response_code(404);
        break;
}
