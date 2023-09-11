<?php
class GalleryController
{
    public function __construct(GalleryGateway $gateway, AdminGateway $adminGateway)
    {
        $this->gateway = $gateway;
        $this->admin = $adminGateway;
    }


    public function processRequest(string $action, ?string $id): void
    {
        $this->controller($action);
    }

    private function controller(string $action): void
    {
        $data = json_decode(file_get_contents("php://input"), true);
        $page = 0;
        $id = 0;
        $name = "";
        $authAction = false;

        if (isset($_GET["page"])) {
            $page = $_GET["page"];
        }
        if (isset($_GET["id"])) {
            $id = $_GET["id"];
        }
        if (isset($_GET["name"])) {
            $name = $_GET["name"];
        }

        if (isset($_SERVER["HTTP_AUTHORIZATION"])) {
            list($type, $token) = explode(" ", $_SERVER["HTTP_AUTHORIZATION"], 2);
            if (strcasecmp($type, "Bearer") == 0) {
                $authAction = $this->admin->authAction($token, array(3));
            } else {
                //echo "no bearer";
            }
        } else {
            //echo "no token";
        }

        switch ($action) {
            case 'getall':
                $result = $this->gateway->getAll($page);
                http_response_code(200);
                echo json_encode($result);
                return;

            case 'getByCategory':
                $result = $this->gateway->getByCategory($id);
                http_response_code(200);
                echo json_encode($result);
                return;

            case 'getByCategoryName':
                $result = $this->gateway->getByCategoryName($name);
                http_response_code(200);
                echo json_encode($result);
                return;

            case 'getImageCategories':
                $result = $this->gateway->getImageCategories($id);
                http_response_code(200);
                echo json_encode($result);
                return;

            case 'getCategories':
                $result = $this->gateway->getCategories();
                http_response_code(201);
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

        switch ($action) {
            case 'create':
                $id = $this->gateway->create($data["data"]);
                http_response_code(201);
                echo json_encode([
                    "message" => "Created",
                    "data" => $id,
                    "token" => $authAction
                ]);
                break;

            case 'multipleCreate':
                $this->gateway->multipleCreate($data["data"]);
                http_response_code(201);
                echo json_encode([
                    "message" => "Items created",
                    "token" => $authAction
                ]);
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
                $this->gateway->delete($id);
                http_response_code(200);
                echo json_encode([
                    "message" => "Item deleted",
                    "token" => $authAction
                ]);
                break;

            case 'multipleDelete':
                $this->gateway->multipleDelete($data["data"]);
                http_response_code(200);
                echo json_encode([
                    "message" => "Items deleted",
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
                $this->gateway->updateCategory($data["data"]);
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
        }
    }
}
