<?php
class EmployeesController
{
    public function __construct(EmployeesGateway $gateway)
    {
        $this->gateway = $gateway;
    }


    public function processRequest(string $action, ?string $id, $authAction): void
    {
        $this->controller($action, $id, $authAction);
    }

    private function controller(string $action, ?string $id, $authAction): void
    {
        $data = json_decode(file_get_contents("php://input"), true);

        switch ($action) {
            case 'getall':
                $result = $this->gateway->getAll();
                http_response_code(201);
                echo json_encode($result);
                return;
            case 'get':
                $result = $this->gateway->get($id);
                http_response_code(201);
                echo json_encode([
                    "message" => "Data provided",
                    "data" =>  $result
                ]);
                return;

            case 'get-departments':
                $result = $this->gateway->getDepartments($id);
                http_response_code(201);
                echo json_encode([
                    ...$result
                ]);
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
                $id = $this->gateway->create($data["data"]);
                http_response_code(201);
                echo json_encode([
                    "message" => "Item created",
                    "data" => $id,
                    "token" => $authAction
                ]);
                break;
            case 'update':
                $result = $this->gateway->update($data["data"]);
                http_response_code(200);
                echo json_encode([
                    "message" => "Item edited",
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
            case 'create-department':
                $id = $this->gateway->createDepartment($data);
                http_response_code(201);
                echo json_encode([
                    "message" => "Item created",
                    "data" => $id,
                    "token" => $authAction
                ]);
                break;
            case 'update-department':
                $id = $this->gateway->updateDepartment($data, $id);
                http_response_code(201);
                echo json_encode([
                    "message" => "Item updated",
                    "token" => $authAction
                ]);
                break;
            case 'delete-department':
                $this->gateway->deleteDepartment($id);
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
