<?php
class PriceListController
{
    public function __construct(Database $database)
    {
        $this->gateway = new PriceListGateway($database);
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
        $uri = str_replace("admin/", "", $_SERVER["REQUEST_URI"]);
        $url_parts = explode("/", $uri);

        if ($method == "GET" && $uri == "/api/pricelist") {
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

        if (!$this->utils->checkUserAuthorization($method, $authAction["permissions"])) {
            http_response_code(403);
            echo json_encode([
                "message" => "User is not permitted to this action"
            ]);
            return;
        }

        switch ($method | $uri) {
            case ($method == "POST" && $uri == "/api/pricelist"):
                $id = $this->gateway->create($data["data"]);
                http_response_code(201);
                echo json_encode([
                    "message" => "Created",
                    "data" => $id,
                    "token" => $authAction["token"]
                ]);
                break;

            case ($method == "PUT" && preg_match('/^\/api\/pricelist\/[0-9]*$/', $uri)):
                $result = $this->gateway->update($data["data"], $url_parts[3]);
                http_response_code(200);
                echo json_encode([
                    "message" => "Updated",
                    "token" => $authAction["token"]
                ]);
                break;

            case ($method == "DELETE" && preg_match('/^\/api\/pricelist\/[0-9]*$/', $uri)):
                $this->gateway->delete($url_parts[3]);
                http_response_code(200);
                echo json_encode([
                    "message" => "Deleted",
                    "token" => $authAction["token"]
                ]);
        }
    }
}
