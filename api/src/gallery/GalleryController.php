<?php
class GalleryController
{
    public function __construct(Database $database)
    {
        $this->gateway = new GalleryGateway($database);
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
        $uri = preg_replace('/page=[0-9]+/', "", $uri);
        $uri = preg_replace('/\/\?\&/', "/?", $uri);
        $uri = preg_replace('/\/\?$/', "", $uri);
        $url_parts = explode("/", $uri);

        $limit = 8;
        $offset = ($page > 0 ? $page - 1 : 0) * $limit;
        $pagination = "$offset, $limit";

        switch ($method | $uri) {
            case ($method == "GET" && $uri == "/api/gallery"):
                $result = $this->gateway->getAll($pagination);
                if (($result["total_length"] / $limit) == 0) {
                    $result["total_pages"] = 0;
                } else {
                    $result["total_pages"] = ceil($result["total_length"] / $limit);
                }
                echo json_encode($result);
                return;

            case ($method == "GET" && preg_match('/\/api\/gallery\/\?category=[0-9]*/', $uri) && isset($_GET["category"])):
                $category_id = $_GET["category"];
                $result = $this->gateway->getByCategory($category_id, $pagination);
                if (($result["total_length"] / $limit) == 0) {
                    $result["total_pages"] = 0;
                } else {
                    $result["total_pages"] = ceil($result["total_length"] / $limit);
                }
                echo json_encode($result);
                return;

            case ($method == "GET" && preg_match('/\/api\/gallery\/\?categoryName=[0-9]*/', $uri) && isset($_GET["categoryName"])):
                $category_name = $_GET["categoryName"];
                $result = $this->gateway->getByCategoryName($category_name, $pagination);
                echo json_encode($result);
                return;

            case ($method == "GET" && preg_match('/\/api\/gallery\/[0-9]*\/categories/', $uri)):
                $result = $this->gateway->getImageCategories($url_parts[3]);
                echo json_encode($result);
                return;

            case ($method == "GET" && $uri == "/api/gallery/categories"):
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
            case ($method == "POST" && $uri == "/api/gallery"):
                $this->gateway->create($data["data"]);
                http_response_code(201);
                echo json_encode([
                    "message" => "Created",
                    "token" => $authAction["token"]
                ]);
                break;

            case ($method == "POST" && $uri == "/api/gallery/multiple"):
                $this->gateway->multipleCreate($data["ids"]);
                http_response_code(201);
                echo json_encode([
                    "message" => "Images created",
                    "token" => $authAction["token"]
                ]);
                break;

            case ($method == "PUT" && preg_match('/^\/api\/gallery\/[0-9]*$/', $uri)):
                $result = $this->gateway->update($data["data"]);
                echo json_encode([
                    "message" => "Updated",
                    "token" => $authAction["token"]
                ]);
                break;

            case ($method == "DELETE" && preg_match('/^\/api\/gallery\/[0-9]*$/', $uri)):
                $this->gateway->delete($url_parts[3]);
                echo json_encode([
                    "message" => "Image deleted",
                    "token" => $authAction["token"]
                ]);
                break;
            case ($method == "DELETE" && preg_match('/^\/api\/gallery\/multiple\/[\w%]*$/', $uri)):
                $decoded_ids_array = json_decode(urldecode($url_parts[4]), true);
                if ($decoded_ids_array !== null) {
                    $this->gateway->multipleDelete($decoded_ids_array);
                    echo json_encode([
                        "message" => "Images deleted",
                        "token" => $authAction["token"]
                    ]);
                } else {
                    echo "Error decoding the array parameter.";
                }
                break;

            case ($method == "POST" && $uri == "/api/gallery/categories"):
                $this->gateway->createCategory($data["data"]);
                http_response_code(201);
                echo json_encode([
                    "message" => "Created",
                    "token" => $authAction["token"]
                ]);
                break;

            case ($method == "PUT" && preg_match('/^\/api\/gallery\/categories\/[0-9]*$/', $uri)):
                $this->gateway->updateCategory($data["data"], $url_parts[4]);
                echo json_encode([
                    "message" => "Updated",
                    "token" => $authAction["token"]
                ]);
                break;

            case ($method == "DELETE" && preg_match('/^\/api\/gallery\/categories\/[0-9]*$/', $uri)):
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
