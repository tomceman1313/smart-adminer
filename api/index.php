<?php

$DIRECTORIES = array(
    "Auth", "Users", "PriceList", "Notifications", "Articles", "Gallery", "Events", "Documents", "Products", "Vacancies", "Employees", "Orders", "Emails", "Pages"
);

$FILES = array(
    "Database", "ErrorHandler", "Utils", "publicFolderPath", "products/ManufacturerGateway", "products/CategoryGateway"
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
//header("Access-Control-Allow-Origin: https://domov-sulicka.cz");
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
//$database = new Database("localhost", "u139635604_cms", "u139635604_admin", "Domov_sulicka2024");
$URI = str_replace("admin/", "", $_SERVER["REQUEST_URI"]);
$URL_PARTS = explode("/", $URI);
$REQUEST_METHOD = $_SERVER['REQUEST_METHOD'];

$id = null;
$page = null;
$controller = null;

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
        $authAction = $auth->authAction($token, $URL_PARTS[2]);
    }
}

switch ($URL_PARTS[2]) {
    case 'auth':
        $controller = new AuthController($auth);
        $controller->processRequest();
        break;
    case 'products':
        $controller = new ProductsController($database);
        $controller->processRequest($authAction);
        break;
    case 'users':
        $controller = new UsersController($database);
        $controller->processRequest($authAction);
        break;
    case 'pricelist':
        $controller = new PriceListController($database);
        $controller->processRequest($authAction);
        break;
    case 'notifications':
        $controller = new NotificationsController($database);
        $controller->processRequest($authAction);
        break;
    case 'articles':
        $controller = new ArticlesController($database);
        $controller->processRequest($page, $authAction);
        break;
    case 'gallery':
        $controller = new GalleryController($database);
        $controller->processRequest($page, $authAction);
        break;

    case 'documents':
        $controller = new DocumentsController($database);
        $controller->processRequest($page, $authAction);
        break;
    case 'events':
        $controller = new EventsController($database);
        $controller->processRequest($page, $authAction);
        break;

    case 'vacancies':
        $controller = new VacanciesController($database);
        $controller->processRequest($page, $authAction);
        break;
    case 'employees':
        $controller = new EmployeesController($database);
        $controller->processRequest($page, $authAction);
        break;
    case 'orders':
        $controller = new OrdersController($database);
        $controller->processRequest($page, $authAction);
        break;
    case 'emails':
        $controller = new EmailsController($database);
        $controller->processRequest();
        break;
    case 'pages':
        $controller = new PagesController($database);
        $controller->processRequest($URL_PARTS, $authAction);
        break;
    default:
        http_response_code(404);
        break;
}
