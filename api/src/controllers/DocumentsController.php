<?php
class DocumentsConroller
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
        switch ($action) {
            case 'getall':
                $data = json_decode(file_get_contents("php://input"), true);
                $authAction = $this->admin->authAction($data["token"], array(3));
                if (!$authAction) {
                    http_response_code(403);
                    echo json_encode([
                        "message" => "Access denied"
                    ]);
                } else {
                    $result = $this->gateway->getAll();
                    http_response_code(200);
                    echo json_encode([
                        "message" => "Data provided",
                        "data" =>  $result,
                        "token" => $data["token"]
                    ]);
                }
                break;

            case 'getByCategory':
                $data = json_decode(file_get_contents("php://input"), true);
                $authAction = $this->admin->authAction($data["token"], array(3));
                if (!$authAction) {
                    http_response_code(403);
                    echo json_encode([
                        "message" => "Access denied"
                    ]);
                } else {
                    $result = $this->gateway->getByCategory($data["category_id"]);
                    http_response_code(200);
                    echo json_encode([
                        "message" => "Data provided",
                        "data" =>  $result,
                        "token" => $data["token"]
                    ]);
                }
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
                    $id = $this->gateway->create($data["data"]);
                    http_response_code(201);
                    echo json_encode([
                        "message" => "Item created",
                        "data" => $id,
                        "token" => $authAction
                    ]);
                }
                break;

            case 'multipleCreate':
                $data = json_decode(file_get_contents("php://input"), true);
                $authAction = $this->admin->authAction($data["token"], array(3));
                if (!$authAction) {
                    http_response_code(403);
                    echo json_encode([
                        "message" => "Access denied"
                    ]);
                } else {
                    $this->gateway->multipleCreate($data["data"]);
                    http_response_code(201);
                    echo json_encode([
                        "message" => "Item created",
                        "token" => $authAction
                    ]);
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
                            "message" => "Item edited",
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
                        "message" => "Item deleted",
                        "data" => $id,
                        "token" => $authAction
                    ]);
                }
                break;
            case 'multipleDelete':
                $data = json_decode(file_get_contents("php://input"), true);
                $authAction = $this->admin->authAction($data["token"], array(3));
                if (!$authAction) {
                    http_response_code(403);
                    echo json_encode([
                        "message" => "Access denied"
                    ]);
                } else {
                    $this->gateway->multipleDelete($data["data"]);
                    http_response_code(200);
                    echo json_encode([
                        "message" => "Items deleted",
                        "token" => $authAction
                    ]);
                }
                break;
            default:
                break;
        }

        //* SWITCH for category methods
        switch ($action) {
            case 'getCategories':
                $data = json_decode(file_get_contents("php://input"), true);
                $authAction = $this->admin->authAction($data["token"], array(3));
                if (!$authAction) {
                    http_response_code(403);
                    echo json_encode([
                        "message" => "Access denied"
                    ]);
                } else {
                    $result = $this->gateway->getCategories();
                    http_response_code(201);
                    echo json_encode([
                        "message" => "Data provided",
                        "data" =>  $result,
                        "token" => $data["token"]
                    ]);
                }
                break;
            case 'createCategory':
                $data = json_decode(file_get_contents("php://input"), true);
                $authAction = $this->admin->authAction($data["token"], array(3));
                if (!$authAction) {
                    http_response_code(403);
                    echo json_encode([
                        "message" => "Access denied"
                    ]);
                } else {
                    $id = $this->gateway->createCategory($data["data"]);
                    http_response_code(201);
                    echo json_encode([
                        "message" => "Item created",
                        "data" => $id,
                        "token" => $authAction
                    ]);
                }
                break;
            case 'updateCategory':
                $data = json_decode(file_get_contents("php://input"), true);
                $authAction = $this->admin->authAction($data["token"], array(3));
                if (!$authAction) {
                    http_response_code(403);
                    echo json_encode([
                        "message" => "Access denied"
                    ]);
                } else {
                    $result = $this->gateway->updateCategory($data["data"]);
                    if ($result) {
                        http_response_code(200);
                        echo json_encode([
                            "message" => "Item edited",
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

            case 'deleteCategory':
                $data = json_decode(file_get_contents("php://input"), true);
                $authAction = $this->admin->authAction($data["token"], array(3));
                if (!$authAction) {
                    http_response_code(403);
                    echo json_encode([
                        "message" => "Access denied"
                    ]);
                } else {
                    $this->gateway->deleteCategory($data["id"]);
                    http_response_code(200);
                    echo json_encode([
                        "message" => "Item deleted",
                        "token" => $authAction
                    ]);
                }
                break;
            default:
                break;
        }
    }
}
