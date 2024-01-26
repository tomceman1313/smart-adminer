<?php
class NotificationsController
{
    public function __construct(NotificationsGateway $gateway)
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

        if ($action == 'getall') {
            $result = $this->gateway->getAll();
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
            case 'create':
                $id = $this->gateway->create($data["data"]);
                http_response_code(201);
                echo json_encode([
                    "message" => "Created",
                    "data" => $id,
                    "token" => $authAction
                ]);
                break;

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
        }
    }
}
