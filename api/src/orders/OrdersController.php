<?php

class OrdersController
{
    public function __construct(Database $database)
    {
        $this->gateway = new OrdersGateway($database);
        $this->utils = new Utils($database);
    }

    public function processRequest($authAction): void
    {
        $this->controller($authAction);
    }

    private function controller($authAction): void
    {
        $data = json_decode(file_get_contents("php://input"), true);
        $method = $_SERVER['REQUEST_METHOD'];
        $uri = $this->utils->getUrlParts()["url"];
        $url_parts = $this->utils->getUrlParts()["url_parts"];

        switch ($method | $uri) {
            case ($method == "GET" && $uri == "/api/orders"):
                $data = $this->gateway->getAll();
                echo json_encode($data);
                return;

            case ($method == "GET" && preg_match('/^\/api\/orders\/[0-9]+$/', $uri)):
                $data = $this->gateway->get($url_parts[3]);
                echo json_encode($data);
                return;

            case ($method == "GET" && $uri == "/api/orders/statuses"):
                $data = $this->gateway->getStatusCodes();
                echo json_encode($data);
                return;

            case ($method == "GET" && $uri == "/api/orders/shipping"):
                $data = $this->gateway->getShippingTypes();
                echo json_encode($data);
                return;

            case ($method == "POST" && $uri == "/api/orders/filter"):
                $response = $this->gateway->filterOrders($data);
                echo json_encode($response);
                return;

            case ($method == "GET" && preg_match('/^\/api\/orders\/filter\/[0-9]+$/', $uri)):
                $data = $this->gateway->findById($url_parts[4]);
                echo json_encode($data);
                return;

            case ($method == "POST" && $uri == "/api/orders"):
                $id = $this->gateway->create($data);
                echo json_encode([
                    "message" => "Created",
                    "id" => $id
                ]);
                return;
        }

        if (!$authAction) {
            http_response_code(403);
            echo json_encode([
                "message" => "Access denied"
            ]);
            return;
        }

        if (!$this->utils->checkUserAuthorization($method, $authAction["permissions"])) {
            http_response_code(403);
            echo json_encode([
                "message" => "User is not permitted to this action"
            ]);
            return;
        }

        switch ($method | $uri) {
            case ($method == "PUT" && preg_match('/^\/api\/orders\/[0-9]+$/', $uri)):
                $this->gateway->update($data["data"]);
                echo json_encode([
                    "message" => "Updated",
                    "token" => $authAction["token"]
                ]);
                break;

            case ($method == "PUT" && preg_match('/^\/api\/orders\/[0-9]+\/status$/', $uri)):
                $this->gateway->updateStatus($data["data"]);
                echo json_encode([
                    "message" => "Updated",
                    "token" => $authAction["token"]
                ]);
                break;

            case ($method == "DELETE" && preg_match('/^\/api\/orders\/[0-9]+$/', $uri)):
                $this->gateway->delete($url_parts[3]);
                echo json_encode([
                    "message" => "Deleted",
                    "token" => $authAction["token"]
                ]);
                break;

            default:
                echo "Wrong URI";
        }
    }
}
