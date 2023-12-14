<?php
class PagesController
{
    public function __construct(PagesGateway $gateway, AdminGateway $adminGateway)
    {
        $this->gateway = $gateway;
        $this->admin = $adminGateway;
    }


    public function processRequest(string $action, ?string $id): void
    {
        $this->controller($action);
    }

    private function controller(string $action): void
    {
        $data = json_decode(file_get_contents("php://input"), true);
        $name = "";
        $authAction = false;

        if (isset($_GET["name"])) {
            $name = $_GET["name"];
        }
        if (isset($_SERVER["HTTP_AUTHORIZATION"])) {
            list($type, $token) = explode(" ", $_SERVER["HTTP_AUTHORIZATION"], 2);
            if (strcasecmp($type, "Bearer") == 0) {
                $authAction = $this->admin->authAction($token, array(3));
            } else {
                //echo "no bearer";
            }
        } else {
            //echo "no token";
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
