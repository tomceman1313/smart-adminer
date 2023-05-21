<?php
class ProductsController
{
    public function __construct(ProductsGateway $gateway, AdminGateway $adminGateway, ManufacturerGateway $manufacturerGateway, CategoryGateway $categoryGateway)
    {
        $this->gateway = $gateway;
        $this->manufacturer = $manufacturerGateway;
        $this->category = $categoryGateway;
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
        if (isset($_GET["offset"])) {
            $offset = $_GET["offset"];
        }
        if (isset($_GET["id"])) {
            $id = $_GET["id"];
        }
        switch ($action) {
            case 'getall':
                $data = $this->gateway->getAll($offset);
                http_response_code(200);
                echo json_encode($data);
                break;

            case 'get':
                $data = $this->gateway->get($id);
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
                        $id = $this->gateway->create($data["data"]);
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
                    $id = $this->gateway->delete($id);
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
                    $result = $this->gateway->deleteImageWithUpdate($data["name"], $id);
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

                $result = $this->category->getCategories();
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

                $id = $this->category->createCategory($data["data"]);
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

                $result = $this->category->updateCategory($data["data"]);
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

                $this->category->deleteCategory($data["id"]);
                http_response_code(200);
                echo json_encode([
                    "message" => "Item deleted",
                    "token" => $authAction
                ]);
                break;

            case 'test':
                var_dump($data);
            default:
                break;
        }

        //* SWITCH for manufacturer methods
        switch ($action) {
            case 'getManufacturers':
                $result = $this->manufacturer->getAll();
                http_response_code(201);
                echo json_encode([
                    "message" => "Data provided",
                    "data" =>  $result
                ]);
                break;

            case 'createManufacturer':
                $authAction = $this->admin->authAction($data["token"], array(3));
                if (!$authAction) {
                    http_response_code(403);
                    echo json_encode([
                        "message" => "Access denied"
                    ]);
                    break;
                }

                $id = $this->manufacturer->create($data["data"]);
                http_response_code(201);
                echo json_encode([
                    "message" => "Item created",
                    "data" => $id,
                    "token" => $authAction
                ]);
                break;

            case 'updateManufacturer':
                $authAction = $this->admin->authAction($data["token"], array(3));

                if (!$authAction) {
                    http_response_code(403);
                    echo json_encode([
                        "message" => "Access denied"
                    ]);
                    break;
                }

                $result = $this->manufacturer->update($data["data"]);
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
                break;

            case 'deleteManufacturer':
                $authAction = $this->admin->authAction($data["token"], array(3));

                if (!$authAction) {
                    http_response_code(403);
                    echo json_encode([
                        "message" => "Access denied"
                    ]);
                    break;
                }

                $this->manufacturer->delete($data["id"]);
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
