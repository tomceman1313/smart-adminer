<?php
class EventsConroller
{
    public function __construct(EventsGateway $gateway, AdminGateway $adminGateway)
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
        switch ($action) {
            case 'getall':
                $data = $this->gateway->getAll();
                http_response_code(200);
                echo json_encode([
                    "message" => "Data provided",
                    "data" => $data
                ]);
                break;

            case 'get':
                $data = $this->gateway->get($data["id"]);
                http_response_code(200);
                echo json_encode([
                    "message" => "Event provided",
                    "data" => $data
                ]);
                break;

            case 'get-by-category':
                $data = $this->gateway->getByCategory($data["category_id"]);
                http_response_code(200);
                echo json_encode($data);
                break;

            case 'create':
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
                        http_response_code(201);
                        echo json_encode([
                            "message" => "Event created",
                            "data" => $id,
                            "token" => $authAction
                        ]);
                    }
                }
                break;

            case 'update':
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
                $result = $this->gateway->getCategory($data["id"]);
                echo json_encode([
                    "data" =>  $result
                ]);
                break;

            case 'delete-image':
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

        //* SWITCH for category methods
        switch ($action) {
            case 'getCategories':
                $result = $this->gateway->getCategories();
                http_response_code(201);
                echo json_encode([
                    "message" => "Data provided",
                    "data" =>  $result
                ]);
                break;

            case 'createCategory':
                $authAction = $this->admin->authAction($data["token"], array(3));
                if (!$authAction) {
                    http_response_code(403);
                    echo json_encode([
                        "message" => "Access denied"
                    ]);
                    break;
                }

                $id = $this->gateway->createCategory($data["data"]);
                http_response_code(201);
                echo json_encode([
                    "message" => "Item created",
                    "data" => $id,
                    "token" => $authAction
                ]);
                break;

            case 'updateCategory':
                $authAction = $this->admin->authAction($data["token"], array(3));

                if (!$authAction) {
                    http_response_code(403);
                    echo json_encode([
                        "message" => "Access denied"
                    ]);
                    break;
                }

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
                $authAction = $this->admin->authAction($data["token"], array(3));

                if (!$authAction) {
                    http_response_code(403);
                    echo json_encode([
                        "message" => "Access denied"
                    ]);
                    break;
                }

                $this->gateway->deleteCategory($data["id"]);
                http_response_code(200);
                echo json_encode([
                    "message" => "Item deleted",
                    "token" => $authAction
                ]);
                break;
            default:
                break;
        }
    }
}
