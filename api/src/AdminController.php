<?php
class AdminController
{
    public function __construct(AdminGateway $gateway)
    {
        $this->gateway = $gateway;
    }


    public function processRequest(string $action, ?string $id): void
    {
        $this->userControl($action);
    }

    private function userControl(string $action): void
    {
        switch ($action) {
            case 'show':
                echo json_encode($this->gateway->getAll());
                break;
            case 'verify':
                $data = json_decode(file_get_contents("php://input"), true);
                $result = $this->gateway->checkUser($data);
                if ($result) {
                    http_response_code(201);
                    echo json_encode([
                        "message" => "success"
                    ]);
                } else {
                    http_response_code(200);
                    echo json_encode([
                        "message" => "wrong"
                    ]);
                }
                break;

            case 'create':
                $data = json_decode(file_get_contents("php://input"), true);
                $id = $this->gateway->create($data);

                http_response_code(201);
                echo json_encode([
                    "message" => "User created",
                    "id" => $id
                ]);

                break;
            case 'edit':
                $data = json_decode(file_get_contents("php://input"), true);
                $current = $this->gateway->get($data['id']);
                $id = $this->gateway->update($current, $data);

                http_response_code(201);
                echo json_encode([
                    "message" => "User edited",
                    "id" => $id
                ]);

                break;
            case 'delete':
                $data = json_decode(file_get_contents("php://input"), true);
                //echo json_encode($this->gateway->checkUser($data));
                $this->gateway->delete($data["id"]);
                http_response_code(201);
                echo json_encode([
                    "message" => "User deleted"
                ]);
                break;
            default:
                break;
        }
    }
}
