<?php
class DocumentsController
{
    public function __construct(DocumentsGateway $gateway, AdminGateway $adminGateway)
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
        $offset = 0;
        $id = 0;
        $authAction = false;

        if (isset($_GET["offset"])) {
            $offset = $_GET["offset"];
        }
        if (isset($_GET["id"])) {
            $id = $_GET["id"];
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
                $result = $this->gateway->getAll();
                http_response_code(200);
                echo json_encode($result);
                return;

            case 'getByCategory':
                $result = $this->gateway->getByCategory($id);
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


        //* SWITCH for category methods
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
                    "message" => "Created",
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
                $id = $this->gateway->delete($id);
                http_response_code(200);
                echo json_encode([
                    "message" => "Item deleted",
                    "data" => $id,
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
                    "message" => "Item created",
                    "data" => $id,
                    "token" => $authAction
                ]);
                break;

            case 'updateCategory':
                $result = $this->gateway->updateCategory($data["data"]);
                if ($result) {
                    http_response_code(200);
                    echo json_encode([
                        "message" => "Item edited",
                        "token" => $authAction
                    ]);
                }
                break;

            case 'deleteCategory':
                $this->gateway->deleteCategory($id);
                http_response_code(200);
                echo json_encode([
                    "message" => "Item deleted",
                    "token" => $authAction
                ]);
                break;
        }
    }
}
