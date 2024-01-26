<?php

class UsersController
{
    public function __construct(UsersGateway $gateway)
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
            case 'checkNameAvailability':
                $result = $this->gateway->checkNameAvailability($data["name"]);
                http_response_code(200);
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
            case 'getall':
                $result = $this->gateway->getAll();
                http_response_code(200);
                echo json_encode([
                    "message" => "Data provided",
                    "data" => $result,
                    "token" => $authAction
                ]);
                break;

            case 'get':
                $result = $this->gateway->get($id);
                http_response_code(200);
                echo json_encode([
                    "data" => $result,
                    "token" => $authAction
                ]);
                break;

            case 'create':
                $id = $this->gateway->create($data["data"]);
                http_response_code(201);
                echo json_encode([
                    "message" => "User created",
                    "data" => $id,
                    "token" => $authAction
                ]);
                break;

            case 'update':
                $this->gateway->update($data["data"]);

                http_response_code(200);
                echo json_encode([
                    "message" => "User edited",
                    "token" => $authAction
                ]);
                break;

            case 'delete':
                $id = $this->gateway->delete($id);
                http_response_code(200);
                echo json_encode([
                    "message" => "User deleted",
                    "data" => $id,
                    "token" => $authAction
                ]);
                break;

            case 'getroles':
                $response = $this->gateway->getRoles();
                http_response_code(200);
                echo json_encode([
                    "message" => "Data provided",
                    "data" => $response,
                    "token" => $authAction
                ]);
                break;

            case 'update_role':
                $response = $this->gateway->updateRole($data["data"]);
                http_response_code(200);
                echo json_encode([
                    "message" => "Role updated",
                    "data" => $response,
                    "token" => $authAction
                ]);
                break;

            case 'change_password':
                $response = $this->gateway->changePassword($data["data"]);
                http_response_code(200);
                echo json_encode([
                    "message" => "Password change",
                    "success" => $response,
                    "token" => $authAction
                ]);
                break;
        }
    }
}
