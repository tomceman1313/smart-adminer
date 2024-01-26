<?php
class PagesController
{
    public function __construct(PagesGateway $gateway)
    {
        $this->gateway = $gateway;
    }


    public function processRequest(string $action, $authAction): void
    {
        $this->controller($action, $authAction);
    }

    private function controller(string $action, $authAction): void
    {
        $data = json_decode(file_get_contents("php://input"), true);
        $name = "";

        if (isset($_GET["name"])) {
            $name = $_GET["name"];
        }


        if ($action == 'getall') {
            $result = $this->gateway->getAll();
            http_response_code(200);
            echo json_encode($result);
            return;
        }

        if ($action == 'getAllPageParts') {
            $result = $this->gateway->getAllPageParts($name);
            http_response_code(200);
            echo json_encode($result);
            return;
        }

        if ($action == 'get') {
            $result = $this->gateway->get($name);
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
            case 'update':
                $this->gateway->update($data["data"]);
                http_response_code(200);
                echo json_encode([
                    "message" => "Updated",
                    "token" => $authAction
                ]);
                break;
        }
    }
}
