<?php
class ArticlesController
{
    public function __construct(ArticlesGateway $gateway)
    {
        $this->gateway = $gateway;
    }


    public function processRequest(string $action, ?string $id, ?string $page, $authAction): void
    {
        $this->controller($action, $id, $page, $authAction);
    }

    private function controller(string $action, ?string $id, ?string $page, $authAction): void
    {
        $data = json_decode(file_get_contents("php://input"), true);

        switch ($action) {
            case 'getall':
                $data = $this->gateway->getAll();
                http_response_code(200);
                echo json_encode($data);
                return;

            case 'getNews':
                $data = $this->gateway->getNews();
                http_response_code(200);
                echo json_encode($data);
                return;

            case 'get':
                $data = $this->gateway->get($id);
                http_response_code(200);
                echo json_encode($data);
                return;

            case 'getByCategory':
                $data = $this->gateway->getByCategory($id);
                http_response_code(200);
                echo json_encode($data);
                return;

            case 'getByCategoryName':
                if (isset($_GET["name"])) {
                    $data = $this->gateway->getByCategoryName($_GET["name"]);
                    http_response_code(200);
                    echo json_encode($data);
                } else {
                    http_response_code(400);
                }
                return;

            case 'getCategories':
                $result = $this->gateway->getCategories();
                http_response_code(201);
                echo json_encode($result);
                return;

            default:
                break;
        }

        if (!$authAction) {
            http_response_code(403);
            echo json_encode([
                "message" => "Access denied"
            ]);
            return;
        }

        switch ($action) {
            case 'create':
                $userId = $this->admin->decodeToken($authAction);
                if ($userId != null) {
                    $id = $this->gateway->create($data["data"], $userId);
                    http_response_code(201);
                    echo json_encode([
                        "message" => "Created",
                        "data" => $id,
                        "token" => $authAction
                    ]);
                }
                break;

            case 'update':
                $result = $this->gateway->update($data["data"]);
                http_response_code(200);
                echo json_encode([
                    "message" => "Updated",
                    "token" => $authAction
                ]);

                break;
            case 'delete':
                $id = $this->gateway->delete($id);
                http_response_code(200);
                echo json_encode([
                    "message" => "Deleted",
                    "data" => $id,
                    "token" => $authAction
                ]);
                break;

            case 'delete-image':
                $result = $this->gateway->deleteImage($data["name"]);
                echo json_encode([
                    "message" => "Deleted",
                    "token" => $authAction
                ]);
                break;

            case 'createCategory':
                $id = $this->gateway->createCategory($data["data"]);
                http_response_code(201);
                echo json_encode([
                    "message" => "Created",
                    "data" => $id,
                    "token" => $authAction
                ]);
                break;

            case 'updateCategory':
                $result = $this->gateway->updateCategory($data["data"]);
                http_response_code(200);
                echo json_encode([
                    "message" => "Updated",
                    "token" => $authAction
                ]);
                break;

            case 'deleteCategory':
                $this->gateway->deleteCategory($id);
                http_response_code(200);
                echo json_encode([
                    "message" => "Deleted",
                    "token" => $authAction
                ]);
                break;
            default:
                break;
        }
    }
}
