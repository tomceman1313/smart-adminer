<?php

class AuthController
{
    public function __construct(AuthGateway $gateway)
    {
        $this->gateway = $gateway;
    }


    public function processRequest(string $action): void
    {
        $this->controller($action);
    }

    private function controller(string $action): void
    {
        $data = json_decode(file_get_contents("php://input"), true);

        switch ($action) {
            case 'auth':
                $response = $this->gateway->auth($data);
                if ($response) {
                    http_response_code(200);
                    echo json_encode([
                        "token" => $response["token"],
                        "username" => $response["username"],
                        "role" => $response["role"],
                        "id" => $response["id"]
                    ]);
                } else {
                    http_response_code(401);
                    echo json_encode([
                        "message" => "Authentication failed"
                    ]);
                }
                return;

            case 'refresh':
                $response = $this->gateway->refresh();
                if ($response != false) {
                    http_response_code(200);
                    echo json_encode([
                        "message" => "refreshed",
                        "data" => $response
                    ]);
                } else {
                    http_response_code(401);
                    echo json_encode([
                        "message" => "relogin"
                    ]);
                }
                return;

            case 'logout':
                setcookie("refresh_token", "", -1, '/', "", false, true);
                http_response_code(200);
                return;
        }
    }
}
