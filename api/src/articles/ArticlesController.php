<?php
class ArticlesController
{
    public function __construct(Database $database)
    {
        $this->gateway = new ArticlesGateway($database);
        $this->auth = new AuthGateway($database);
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
            case ($method == "GET" && $uri == "/api/articles"):
                $data = $this->gateway->getAll();
                echo json_encode($data);
                return;

            case ($method == "GET" && $uri == "/api/articles/news"):
                $data = $this->gateway->getNews();
                echo json_encode($data);
                return;

            case ($method == "GET" && preg_match('/^\/api\/articles\/[0-9]+$/', $uri)):
                $data = $this->gateway->get($url_parts[3]);
                echo json_encode($data);
                return;

            case ($method == "GET" && preg_match('/^\/api\/articles\/\?category=[0-9]+$/', $uri) && isset($_GET["category"])):
                $category_id = $_GET["category"];
                $data = $this->gateway->getByCategory($category_id);
                echo json_encode($data);
                return;

            case ($method == "GET" && preg_match('/^\/api\/articles\/\?categoryName=[\w%]+$/', $uri) && isset($_GET["categoryName"])):
                $category_name = $_GET["categoryName"];
                $data = $this->gateway->getByCategoryName($category_name);
                echo json_encode($data);
                return;

            case ($method == "GET" && preg_match('/\/api\/articles\/\?name=[\w%]+$/', $uri) && isset($_GET["name"])):
                $article_title = $_GET["name"];
                $result = $this->gateway->getByTitle($article_title);
                echo json_encode($result);
                return;

            case ($method == "GET" && preg_match('/\/api\/articles\/\?name=[\w%]+&categoryId=[\w%]+$/', $uri) && isset($_GET["name"]) && isset($_GET["categoryId"])):
                $article_title = $_GET["name"];
                $category_id = $_GET["categoryId"];
                $result = $this->gateway->getByTitle($article_title, $category_id);
                echo json_encode($result);
                return;

            case ($method == "GET" && $uri == "/api/articles/categories"):
                try {
                    $result = $this->gateway->getCategories();
                    echo json_encode($result);
                } catch (Exception $e) {
                    http_response_code(500);
                    echo 'Caught exception: ',  $e->getMessage(), "\n";
                }
                return;
        }

        if (!$authAction) {
            http_response_code(401);
            echo json_encode([
                "message" => "Unauthenticated"
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
            case ($method == "POST" && $uri == "/api/articles"):
                $userId = $this->auth->decodeToken($authAction["token"]);
                if ($userId != null) {
                    $id = $this->gateway->create($data["data"], $userId);
                    http_response_code(201);
                    echo json_encode([
                        "message" => "Created",
                        "data" => $id,
                        "token" => $authAction["token"]
                    ]);
                }
                break;

            case ($method == "PUT" && preg_match('/^\/api\/articles\/[0-9]+$/', $uri)):

                $result = $this->gateway->update($data["data"], $url_parts[3]);
                echo json_encode([
                    "message" => "Updated",
                    "token" => $authAction["token"]
                ]);

                break;

            case ($method == "DELETE" && preg_match('/^\/api\/articles\/[0-9]+$/', $uri)):
                $this->gateway->delete($url_parts[3]);
                echo json_encode([
                    "message" => "Deleted",
                    "token" => $authAction["token"]
                ]);
                break;

            case ($method == "DELETE" && preg_match('/^\/api\/articles\/[0-9]+\/images\/[0-9]+$/', $uri)):
                $this->gateway->deleteImage($url_parts[5]);
                echo json_encode([
                    "message" => "Deleted",
                    "token" => $authAction["token"]
                ]);
                break;

            case ($method == "POST" && $uri == "/api/articles/categories"):
                $this->gateway->createCategory($data["data"]);
                http_response_code(201);
                echo json_encode([
                    "message" => "Created",
                    "token" => $authAction["token"]
                ]);
                break;

            case ($method == "PUT" && preg_match('/^\/api\/articles\/categories\/[0-9]+$/', $uri)):
                $result = $this->gateway->updateCategory($data["data"], $url_parts[4]);
                echo json_encode([
                    "message" => "Updated",
                    "token" => $authAction["token"]
                ]);
                break;

            case ($method == "DELETE" && preg_match('/^\/api\/articles\/categories\/[0-9]+$/', $uri)):
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
