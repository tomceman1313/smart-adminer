<?php

class AuthController
{
    public function __construct(AuthGateway $gateway)
    {
        $this->gateway = $gateway;
    }


    public function processRequest(): void
    {
        $this->controller();
    }

    private function controller(): void
    {
        $data = json_decode(file_get_contents("php://input"), true);
        $method = $_SERVER['REQUEST_METHOD'];
        $uri = preg_replace('/^.*api/', "/api", $_SERVER["REQUEST_URI"]);
        $uri = preg_replace('/page=[0-9]+/', "", $uri);
        $uri = preg_replace('/\/\?\&/', "/?", $uri);
        $uri = preg_replace('/\/\?$/', "", $uri);

        switch ($method | $uri) {
            case ($method == "POST" && $uri == "/api/auth/login"):
                $response = $this->gateway->login($data);
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

            case ($method == "GET" && $uri == "/api/auth/refresh"):
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

            case ($method == "GET" && $uri == "/api/auth/logout"):
                setcookie("refresh_token", "", -1, '/', "", false, true);
                http_response_code(200);
                return;
        }
    }
}
