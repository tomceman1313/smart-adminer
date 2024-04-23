<?php
class ProductsController
{
    public function __construct(Database $database)
    {
        $this->gateway = new ProductsGateway($database);
        $this->manufacturer = new ManufacturerGateway($database);
        $this->category = new CategoryGateway($database);
        $this->utils = new Utils($database);
    }

    public function processRequest($authAction): void
    {
        $this->controller($authAction);
    }

    private function controller($authAction): void
    {
        $data = json_decode(file_get_contents("php://input"), true);
        $method = $_SERVER['REQUEST_METHOD'];
        $uri = $this->utils->getUrlParts()["url"];
        $url_parts = $this->utils->getUrlParts()["url_parts"];

        switch ($method | $uri) {
            case ($method == "GET" && $uri == "/api/products"):
                $data = $this->gateway->getAll();
                echo json_encode($data);
                return;

            case ($method == "GET" && preg_match('/^\/api\/products\/[0-9]+$/', $uri)):
                $data = $this->gateway->get($url_parts[3]);
                echo json_encode($data);
                return;

            case ($method == "GET" && preg_match('/\/api\/products\/\?name=\w+/', $uri) && isset($_GET["name"])):
                $name = $_GET["name"];
                $data = $this->gateway->getByName($name);
                echo json_encode($data);
                return;

            case ($method == "GET" && preg_match('/\/api\/products\/\?category=[0-9]+/', $uri) && isset($_GET["category"])):
                $category_id = $_GET["category"];
                $data = $this->gateway->getByCategory($category_id);
                echo json_encode($data);
                return;

            case ($method == "POST" && $uri == "/api/products/filter"):
                $response = $this->gateway->filterProducts($data);
                echo json_encode($response);
                return;

            case ($method == "POST" && $uri == "/api/products/ids"):
                $data = $this->gateway->getByIds($data);
                echo json_encode($data);
                return;

            case ($method == "GET" && $uri == "/api/products/categories"):
                $result = $this->category->getCategories();
                echo json_encode($result);
                return;

            case ($method == "GET" && $uri == "/api/products/manufacturers"):
                $result = $this->manufacturer->getAll();
                echo json_encode($result);
                return;

            case ($method == "GET" && preg_match('/\/api\/products\/name\/\?name=\w+/', $uri) && isset($_GET["name"])):
                $name = $_GET["name"];
                $result = $this->gateway->checkNameAvailability($name);
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
            case ($method == "POST" && $uri == "/api/products"):
                $this->gateway->create($data["data"]);
                http_response_code(201);
                echo json_encode([
                    "message" => "Created",
                    "token" => $authAction["token"]
                ]);
                break;

            case ($method == "PUT" && preg_match('/^\/api\/products\/[0-9]+$/', $uri)):
                $this->gateway->update($data["data"]);
                echo json_encode([
                    "message" => "Updated",
                    "token" => $authAction["token"]
                ]);
                break;

            case ($method == "DELETE" && preg_match('/^\/api\/products\/[0-9]+$/', $uri)):
                $this->gateway->delete($url_parts[3]);
                echo json_encode([
                    "message" => "Deleted",
                    "token" => $authAction["token"]
                ]);
                break;

            case ($method == "DELETE" && preg_match('/^\/api\/products\/[0-9]+\/images\/[0-9]+$/', $uri)):
                $result = $this->gateway->deleteImageWithUpdate($url_parts[5], $url_parts[3]);
                echo json_encode([
                    "message" => "Image deleted",
                    "token" => $authAction["token"]
                ]);
                break;

            case ($method == "POST" && $uri == "/api/products/categories"):
                $id = $this->category->createCategory($data["data"]);
                http_response_code(201);
                echo json_encode([
                    "message" => "Created",
                    "data" => $id,
                    "token" => $authAction["token"]
                ]);
                break;

            case ($method == "PUT" && preg_match('/^\/api\/products\/categories\/[0-9]+$/', $uri)):
                $result = $this->category->updateCategory($data["data"], $url_parts[4]);
                echo json_encode([
                    "message" => "Updated",
                    "token" => $authAction["token"]
                ]);
                break;

            case ($method == "DELETE" && preg_match('/^\/api\/products\/categories\/[0-9]+$/', $uri)):
                $this->category->deleteCategory($url_parts[4]);
                echo json_encode([
                    "message" => "Deleted",
                    "token" => $authAction["token"]
                ]);
                break;

            case ($method == "POST" && $uri == "/api/products/manufacturers"):
                $this->manufacturer->create($data["data"]);
                http_response_code(201);
                echo json_encode([
                    "message" => "Created",
                    "token" => $authAction["token"]
                ]);
                break;

            case ($method == "PUT" && preg_match('/^\/api\/products\/manufacturers\/[0-9]+$/', $uri)):
                $this->manufacturer->update($data["data"], $url_parts[4]);
                echo json_encode([
                    "message" => "Updated",
                    "token" => $authAction["token"]
                ]);
                break;

            case ($method == "DELETE" && preg_match('/^\/api\/products\/manufacturers\/[0-9]+$/', $uri)):
                $this->manufacturer->delete($url_parts[4]);
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
