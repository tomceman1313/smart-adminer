<?php

$DIRECTORIES = array(
    "Auth", "Users", "Pricelist", "Notifications", "Articles", "Gallery", "Events", "Documents", "Products", "Vacancies", "Employees", "Orders", "Emails", "Pages"
);

$FILES = array(
    "Database", "ErrorHandler", "Utils", "publicFolderPath", "products/ManufacturerGateway", "products/CategoryGateway.php"
);

foreach ($DIRECTORIES as $directory) {
    if (file_exists(__DIR__ . "/src/" . strtolower($directory) . "/$directory" . "Controller.php")) {
        require_once __DIR__ . "/src/" . strtolower($directory) . "/$directory" . "Controller.php";
    }

    if (file_exists(__DIR__ . "/src/" . strtolower($directory) . "/$directory" . "Gateway.php")) {
        require_once __DIR__ . "/src/" . strtolower($directory) . "/$directory" . "Gateway.php";
    }
}

foreach ($FILES as $file) {
    if (file_exists(__DIR__ . "/src/" . $file . ".php")) {
        require_once __DIR__ . "/src/" . $file . ".php";
    }
}

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

$database = new Database("localhost", "admin_console", "penziontop4fancz", "heslo");

//production
//$database = new Database("localhost", "u351850998_cms", "u351850998_tomas", "Tomikz13");
$class = null;
$action = null;
$id = null;
$page = null;

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

if (isset($_GET["page"])) {
    $page = $_GET["page"];
}

$authAction = false;
$auth = new AuthGateway($database);
if (isset($_SERVER["HTTP_AUTHORIZATION"])) {
    list($type, $token) = explode(" ", $_SERVER["HTTP_AUTHORIZATION"], 2);
    if (strcasecmp($type, "Bearer") == 0) {
        $authAction = $auth->authAction($token, array(3));
    }
}



switch ($class) {
    case 'auth':
        $controller = new AuthController($auth);
        $controller->processRequest($action);
        break;
    case 'products':
        $gateway = new ProductsGateway($database);
        $manufacturer = new ManufacturerGateway($database);
        $category = new CategoryGateway($database);
        $controller = new ProductsController($gateway, $manufacturer, $category);
        $controller->processRequest($action, $id, $authAction);
        break;
    case 'users':
        $gateway = new UsersGateway($database);
        $controller = new UsersController($gateway);
        $controller->processRequest($action, $id, $authAction);
        break;
    case 'pricelist':
        $gateway = new PricelistGateway($database);
        $controller = new PricelistController($gateway);
        $controller->processRequest($action, $id, $authAction);
        break;
    case 'notifications':
        $gateway = new NotificationsGateway($database);
        $controller = new NotificationsController($gateway);
        $controller->processRequest($action, $id, $authAction);
        break;

    case 'articles':
        $gateway = new ArticlesGateway($database);
        $controller = new ArticlesController($gateway);
        $controller->processRequest($action, $id, $page, $authAction);
        break;
    case 'gallery':
        $gateway = new GalleryGateway($database);
        $controller = new GalleryController($gateway);
        $controller->processRequest($action, $id, $authAction, $page);
        break;

    case 'documents':
        $gateway = new DocumentsGateway($database);
        $controller = new DocumentsController($gateway);
        $controller->processRequest($action, $id, $authAction);
        break;
    case 'events':
        $gateway = new EventsGateway($database);
        $controller = new EventsController($gateway);
        $controller->processRequest($action, $id, $authAction);
        break;

    case 'vacancies':
        $gateway = new VacanciesGateway($database);
        $controller = new VacanciesController($gateway);
        $controller->processRequest($action, $id, $authAction);
        break;
    case 'employees':
        $gateway = new EmployeesGateway($database);
        $controller = new EmployeesController($gateway);
        $controller->processRequest($action, $id, $authAction);
        break;
    case 'orders':
        $gateway = new OrdersGateway($database);
        $controller = new OrdersController($gateway);
        $controller->processRequest($action, $id, $authAction);
        break;
    case 'emails':
        $gateway = new EmailsGateway($database);
        $controller = new EmailsController($gateway);
        $controller->processRequest($action);
        break;
    case 'pages':
        $gateway = new PagesGateway($database);
        $controller = new PagesController($gateway);
        $controller->processRequest($action, $authAction);
        break;
    default:
        http_response_code(404);
        break;
}
