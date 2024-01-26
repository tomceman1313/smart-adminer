<?php

class OrdersController
{
    public function __construct(OrdersGateway $ordersGateway)
    {
        $this->gateway = $ordersGateway;
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
                $data = $this->gateway->getAll();
                http_response_code(200);
                echo json_encode($data);
                return;

            case 'get':
                $data = $this->gateway->get($id);
                http_response_code(200);
                echo json_encode($data);
                return;

            case 'getStatusCodes':
                $data = $this->gateway->getStatusCodes();
                http_response_code(200);
                echo json_encode($data);
                return;

            case 'getShippingTypes':
                $data = $this->gateway->getShippingTypes();
                http_response_code(200);
                echo json_encode($data);
                return;

            case 'filterOrders':
                $response = $this->gateway->filterOrders($data);
                http_response_code(200);
                echo json_encode($response);
                return;

            case 'findById':
                $data = $this->gateway->findById($id);
                http_response_code(200);
                echo json_encode($data);
                return;

            case 'create':
                $id = $this->gateway->create($data);
                http_response_code(200);
                echo json_encode([
                    "message" => "Created",
                    "id" => $id
                ]);
                return;
            case 'test':
                $id = $this->gateway->test();
                http_response_code(200);
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
            case 'update':
                $this->gateway->update($data["data"]);
                http_response_code(200);
                echo json_encode([
                    "message" => "Updated",
                    "token" => $authAction
                ]);
                break;

            case 'updateStatus':
                $this->gateway->updateStatus($data["data"]);
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
