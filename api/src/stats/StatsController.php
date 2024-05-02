<?php
class StatsController
{
    public function __construct(Database $database)
    {
        $this->gateway = new StatsGateway($database);
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

        if (!$authAction) {
            http_response_code(401);
            echo json_encode([
                "message" => "Unauthenticated"
            ]);
            return;
        }

        switch ($method | $uri) {
            case ($method == "GET" && preg_match('/^\/api\/stats\/\?sections=[\w%]+$/', $uri) && isset($_GET["sections"])):
                $result = $this->gateway->getStats(json_decode($_GET["sections"], true));
                echo json_encode([
                    "data" => $result,
                    "token" => $authAction["token"]
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
            case ($method == "POST" && $uri == "/api/settings/login_image"):
                $this->gateway->updateLoginImage($data["data"]);
                http_response_code(201);
                echo json_encode([
                    "message" => "Image changed",
                    "token" => $authAction["token"]
                ]);
                break;
            default:
                echo "Wrong URI";
        }
    }
}
