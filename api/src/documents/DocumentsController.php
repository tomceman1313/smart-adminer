<?php
class DocumentsController
{
    public function __construct(Database $database)
    {
        $this->gateway = new DocumentsGateway($database);
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
            case ($method == "GET" && $uri == "/api/documents"):
                $result = $this->gateway->getAll();
                echo json_encode($result);
                return;

            case ($method == "GET" && preg_match('/\/api\/documents\/\?category=[0-9]*/', $uri) && isset($_GET["category"])):
                $category_id = $_GET["category"];
                $result = $this->gateway->getByCategory($category_id);
                echo json_encode($result);
                return;

            case ($method == "GET" && $uri == "/api/documents/categories"):
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
            case ($method == "POST" && $uri == "/api/documents"):
                $id = $this->gateway->create($data["data"]);
                http_response_code(201);
                echo json_encode([
                    "message" => "Created",
                    "data" => $id,
                    "token" => $authAction["token"]
                ]);

                break;

            case ($method == "POST" && $uri == "/api/documents/multiple"):
                $this->gateway->multipleCreate($data["data"]);
                http_response_code(201);
                echo json_encode([
                    "message" => "Created",
                    "token" => $authAction["token"]
                ]);
                break;

            case ($method == "PUT" && preg_match('/^\/api\/documents\/[0-9]*$/', $uri)):
                $result = $this->gateway->update($data["data"]);
                echo json_encode([
                    "message" => "Updated",
                    "token" => $authAction["token"]
                ]);
                break;

            case ($method == "DELETE" && preg_match('/^\/api\/documents\/[0-9]*$/', $uri)):
                $id = $this->gateway->delete($url_parts[3]);
                echo json_encode([
                    "message" => "Item deleted",
                    "data" => $id,
                    "token" => $authAction["token"]
                ]);
                break;

            case ($method == "DELETE" && preg_match('/^\/api\/documents\/multiple\/[\w%]*$/', $uri)):
                $decoded_ids_array = json_decode(urldecode($url_parts[4]), true);
                if ($decoded_ids_array !== null) {
                    $this->gateway->multipleDelete($decoded_ids_array);
                    echo json_encode([
                        "message" => "Items deleted",
                        "token" => $authAction["token"]
                    ]);
                } else {
                    echo "Error decoding the array parameter.";
                }
                break;

            case ($method == "POST" && $uri == "/api/documents/categories"):
                $this->gateway->createCategory($data["data"]);
                http_response_code(201);
                echo json_encode([
                    "message" => "Created",
                    "token" => $authAction["token"]
                ]);
                break;

            case ($method == "PUT" && preg_match('/^\/api\/documents\/categories\/[0-9]*$/', $uri)):
                $this->gateway->updateCategory($data["data"]);
                echo json_encode([
                    "message" => "Updated",
                    "token" => $authAction["token"]
                ]);
                break;

            case ($method == "DELETE" && preg_match('/^\/api\/documents\/categories\/[0-9]*$/', $uri)):
                $this->gateway->deleteCategory($url_parts[4]);
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