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
                //echo json_encode($this->gateway->checkUser($data));
                $result = $this->gateway->checkUser($data);
                if ($result) {
                    http_response_code(201);
                    echo json_encode([
                        "message" => "success"
                    ]);
                } else {
                    http_response_code(205);
                    echo json_encode([
                        "message" => "wrong"
                    ]);
                }
                break;

            default:
                break;
        }
    }
}
