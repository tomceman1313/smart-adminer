<?php
class NotificationsConroller
{
    public function __construct(NotificationsGateway $gateway)
    {
        $this->gateway = $gateway;
    }


    public function processRequest(string $action, ?string $id): void
    {
        $this->controller($action);
    }

    private function controller(string $action): void
    {
        switch ($action) {
            case 'getall':
                echo json_encode($this->gateway->getAll());
                break;
            case 'create':
                $data = json_decode(file_get_contents("php://input"), true);
                $result = $this->gateway->create($data);

                if ($result) {
                    http_response_code(201);
                    echo json_encode([
                        "message" => "Item created"
                    ]);
                } else {
                    http_response_code(400);
                    echo json_encode([
                        "message" => "Insert failure"
                    ]);
                }
                break;
            case 'update':
                $data = json_decode(file_get_contents("php://input"), true);
                $result = $this->gateway->update($data);

                if ($result) {
                    http_response_code(200);
                    echo json_encode([
                        "message" => "Item edited"
                    ]);
                } else {
                    http_response_code(400);
                    echo json_encode([
                        "message" => "Update failure"
                    ]);
                }
                break;
            default:
                break;
        }
    }
}
