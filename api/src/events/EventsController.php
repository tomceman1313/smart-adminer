<?php
class EventsController
{
    public function __construct(Database $database)
    {
        $this->gateway = new EventsGateway($database);
        $this->auth = new AuthGateway($database);
        $this->utils = new Utils($database);
    }


    public function processRequest(?string $page, $authAction): void
    {
        $this->controller($page, $authAction);
    }

    private function controller(?string $page, $authAction): void
    {
        $data = json_decode(file_get_contents("php://input"), true);
        $method = $_SERVER['REQUEST_METHOD'];
        $uri = str_replace("admin/", "", $_SERVER["REQUEST_URI"]);
        $url_parts = explode("/", $uri);

        switch ($method | $uri) {
            case ($method == "GET" && $uri == "/api/events"):
                $data = $this->gateway->getAll();
                echo json_encode($data);
                return;

            case ($method == "GET" && preg_match('/^\/api\/events\/[0-9]*$/', $uri)):
                $data = $this->gateway->get($url_parts[3]);
                echo json_encode($data);
                return;

            case ($method == "GET" && preg_match('/\/api\/events\/\?category=[0-9]*/', $uri) && isset($_GET["category"])):
                $category_id = $_GET["category"];
                $data = $this->gateway->getByCategory($category_id);
                echo json_encode($data);
                return;

            case ($method == "GET" && $uri == "/api/events/categories"):
                $result = $this->gateway->getCategories();
                echo json_encode($result);
                return;
        }

        if (!$authAction) {
            http_response_code(403);
            echo json_encode([
                "message" => "Access denied"
            ]);
            return;
        }

        if (!$this->utils->checkUserAuthorization($method, $authAction["permissions"])) {
            http_response_code(403);
            echo json_encode([
                "message" => "User is not permitted to this action"
            ]);
            return;
        }

        switch ($method | $uri) {
            case ($method == "POST" && $uri == "/api/events"):
                $userId = $this->auth->decodeToken($authAction);
                if ($userId != null) {
                    $this->gateway->create($data["data"], $userId);
                    http_response_code(201);
                    echo json_encode([
                        "message" => "Created",
                        "token" => $authAction["token"]
                    ]);
                }
                break;

            case ($method == "PUT" && preg_match('/^\/api\/events\/[0-9]*$/', $uri)):
                $result = $this->gateway->update($data["data"]);
                echo json_encode([
                    "message" => "Updated",
                    "token" => $authAction["token"]
                ]);
                break;

            case ($method == "DELETE" && preg_match('/^\/api\/events\/[0-9]*$/', $uri)):
                $this->gateway->delete($url_parts[3]);
                echo json_encode([
                    "message" => "Deleted",
                    "token" => $authAction["token"]
                ]);
                break;

            case ($method == "DELETE" && preg_match('/^\/api\/events\/[0-9]+\/images\/[0-9]+$/', $uri)):
                $this->gateway->deleteImage($url_parts[5]);
                echo json_encode([
                    "token" => $authAction["token"]
                ]);
                break;

            case ($method == "POST" && $uri == "/api/events/categories"):
                $this->gateway->createCategory($data["data"]);
                http_response_code(201);
                echo json_encode([
                    "message" => "Created",
                    "token" => $authAction["token"]
                ]);
                break;

            case ($method == "PUT" && preg_match('/^\/api\/events\/categories\/[0-9]*$/', $uri)):
                $this->gateway->updateCategory($data["data"]);
                echo json_encode([
                    "message" => "Updated",
                    "token" => $authAction["token"]
                ]);
                break;

            case ($method == "DELETE" && preg_match('/^\/api\/events\/categories\/[0-9]*$/', $uri)):
                $this->gateway->deleteCategory($url_parts[3]);
                echo json_encode([
                    "message" => "Deleted",
                    "token" => $authAction["token"]
                ]);
                break;

            default:
                echo "Wrong URI";
        }
    }
}
