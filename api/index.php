<?php
$ENV = parse_ini_file('.env');
ini_set('display_errors', $ENV["SHOW_ERRORS"]);

$DIRECTORIES = array(
    "Auth", "Users", "PriceList", "Notifications", "Articles", "Gallery", "Events", "Documents", "Products", "Vacancies", "Employees", "Orders", "Emails", "Pages", "Images", "Settings", "Stats"
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

header("Access-Control-Allow-Origin: http://localhost:3000");
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

$database = new Database($ENV["DB_HOST"], $ENV["DB_NAME"], $ENV["DB_USER"], $ENV["DB_PASSWORD"]);
$utils = new Utils($database);


$URI = $utils->getUrlParts()["url"];
$URL_PARTS = $utils->getUrlParts()["url_parts"];
$REQUEST_METHOD = $_SERVER['REQUEST_METHOD'];


$controller = null;

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
        $utils->createPublicFolder("public/images/products");
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
        $utils->createPublicFolder("public/images/articles");
        $controller = new ArticlesController($database);
        $controller->processRequest($authAction);
        break;
    case 'gallery':
        $utils->createPublicFolder("public/images/gallery");
        $controller = new GalleryController($database);
        $controller->processRequest($authAction);
        break;

    case 'documents':
        $utils->createPublicFolder("public/files/documents");
        $utils->createPublicFolder("public/images/documents");
        $controller = new DocumentsController($database);
        $controller->processRequest($authAction);
        break;
    case 'events':
        $utils->createPublicFolder("public/images/events");
        $controller = new EventsController($database);
        $controller->processRequest($authAction);
        break;

    case 'vacancies':
        $utils->createPublicFolder("public/images/vacancies");
        $controller = new VacanciesController($database);
        $controller->processRequest($authAction);
        break;
    case 'employees':
        $utils->createPublicFolder("public/images/employees");
        $controller = new EmployeesController($database);
        $controller->processRequest($authAction);
        break;
    case 'orders':
        $controller = new OrdersController($database);
        $controller->processRequest($authAction);
        break;
    case 'emails':
        $controller = new EmailsController($database);
        $controller->processRequest();
        break;
    case 'pages':
        $utils->createPublicFolder("public/images/pages");
        $controller = new PagesController($database);
        $controller->processRequest($authAction);
        break;
    case 'images':
        $controller = new ImagesController($database);
        $controller->processRequest($authAction);
        break;
    case 'settings':
        $controller = new SettingsController($database);
        $controller->processRequest($authAction);
        break;
    case 'stats':
        $controller = new StatsController($database);
        $controller->processRequest($authAction);
        break;
    default:
        http_response_code(404);
        break;
}
