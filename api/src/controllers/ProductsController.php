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
                $data = $this->gateway->getAll();
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

            case 'getByIds':
                $data = $this->gateway->getByIds($data);
                http_response_code(200);
                echo json_encode($data);
                return;

            case 'getCategories':
                $result = $this->category->getCategories();
                http_response_code(201);
                echo json_encode($result);
                return;

            case 'getManufacturers':
                $result = $this->manufacturer->getAll();
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
                http_response_code(200);
                echo json_encode([
                    "message" => "Created",
                    "data" => $id,
                    "token" => $authAction
                ]);

            case 'update':
                $this->gateway->update($data["data"]);
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
                    "message" => "Deleted",
                    "token" => $authAction
                ]);
                break;

            case 'delete-image':
                $result = $this->gateway->deleteImageWithUpdate($data["name"], $id);
                echo json_encode([
                    "message" => "Image deleted",
                    "token" => $data["token"]
                ]);
                break;

            case 'createCategory':
                $id = $this->category->createCategory($data["data"]);
                http_response_code(201);
                echo json_encode([
                    "message" => "Created",
                    "data" => $id,
                    "token" => $authAction
                ]);
                break;

            case 'updateCategory':
                $result = $this->category->updateCategory($data["data"]);
                http_response_code(200);
                echo json_encode([
                    "message" => "Updated",
                    "token" => $authAction
                ]);
                break;

            case 'deleteCategory':
                $this->category->deleteCategory($id);
                http_response_code(200);
                echo json_encode([
                    "message" => "Deleted",
                    "token" => $authAction
                ]);
                break;

            case 'createManufacturer':
                $id = $this->manufacturer->create($data["data"]);
                http_response_code(201);
                echo json_encode([
                    "message" => "Created",
                    "data" => $id,
                    "token" => $authAction
                ]);
                break;

            case 'updateManufacturer':
                $result = $this->manufacturer->update($data["data"]);
                http_response_code(200);
                echo json_encode([
                    "message" => "Updated",
                    "token" => $authAction
                ]);
                break;

            case 'deleteManufacturer':
                $this->manufacturer->delete($id);
                http_response_code(200);
                echo json_encode([
                    "message" => "Deleted",
                    "token" => $authAction
                ]);
                break;
        }
    }
}
