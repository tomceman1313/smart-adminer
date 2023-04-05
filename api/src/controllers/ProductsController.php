<?php
class ProductsController
{
    public function __construct(ProductsGateway $gateway, AdminGateway $adminGateway)
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

        switch ($action) {
            case 'getall':
                $data = json_decode(file_get_contents("php://input"), true);
                $data = $this->gateway->getAll();
                http_response_code(200);
                echo json_encode([
                    "message" => "Data provided",
                    "data" => $data
                ]);
                break;

            case 'get':
                $data = json_decode(file_get_contents("php://input"), true);
                $data = $this->gateway->get($data["id"]);
                http_response_code(200);
                echo json_encode([
                    "message" => "Event provided",
                    "data" => $data
                ]);
                break;

            case 'create':
                $data = json_decode(file_get_contents("php://input"), true);
                $authAction = $this->admin->authAction($data["token"], array(3));
                if (!$authAction) {
                    http_response_code(403);
                    echo json_encode([
                        "message" => "Access denied"
                    ]);
                } else {
                    $userId = $this->admin->decodeToken($authAction);
                    if ($userId != null) {
                        $id = $this->gateway->create($data["data"], $userId);
                        http_response_code(200);
                        echo json_encode([
                            "message" => "Event created",
                            "data" => $id,
                            "token" => $authAction
                        ]);
                    }
                }
                break;

            case 'update':
                $data = json_decode(file_get_contents("php://input"), true);
                $authAction = $this->admin->authAction($data["token"], array(3));
                if (!$authAction) {
                    http_response_code(403);
                    echo json_encode([
                        "message" => "Access denied"
                    ]);
                } else {
                    $result = $this->gateway->update($data["data"]);
                    if ($result) {
                        http_response_code(200);
                        echo json_encode([
                            "message" => "Event edited",
                            "token" => $authAction
                        ]);
                    } else {
                        http_response_code(400);
                        echo json_encode([
                            "message" => "Update failure",
                            "token" => $authAction
                        ]);
                    }
                }

                break;
            case 'delete':
                $data = json_decode(file_get_contents("php://input"), true);
                $authAction = $this->admin->authAction($data["token"], array(3));
                if (!$authAction) {
                    http_response_code(403);
                    echo json_encode([
                        "message" => "Access denied"
                    ]);
                } else {
                    $id = $this->gateway->delete($data["id"]);
                    http_response_code(200);
                    echo json_encode([
                        "message" => "Event deleted",
                        "data" => $id,
                        "token" => $authAction
                    ]);
                }
                break;
            case 'category':
                $data = json_decode(file_get_contents("php://input"), true);
                $result = $this->gateway->getCategory($data["id"]);
                echo json_encode([
                    "data" =>  $result
                ]);
                break;

            case 'delete-image':
                $data = json_decode(file_get_contents("php://input"), true);
                $authAction = $this->admin->authAction($data["token"], array(3));
                if (!$authAction) {
                    http_response_code(403);
                    echo json_encode([
                        "message" => "Access denied"
                    ]);
                } else {
                    $result = $this->gateway->deleteImage($data["name"]);
                    echo json_encode([
                        "message" => "Image deleted",
                        "token" => $data["token"]
                    ]);
                }
                break;
            default:
                break;
        }
    }
}
