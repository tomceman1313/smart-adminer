<?php
class PricelistConroller
{
    public function __construct(PricelistGateway $gateway)
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
                $id = $this->gateway->create($data);

                http_response_code(201);
                echo json_encode([
                    "message" => "Item created",
                    "id" => $id
                ]);

                break;
            case 'update':
                $data = json_decode(file_get_contents("php://input"), true);
                $current = $this->gateway->get($data['id']);
                $id = $this->gateway->update($current, $data);

                http_response_code(201);
                echo json_encode([
                    "message" => "Item edited",
                    "id" => $id
                ]);
                break;
            default:
                break;
        }
    }
}
