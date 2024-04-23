<?php
class SettingsController
{
    public function __construct(Database $database)
    {
        $this->gateway = new SettingsController($database);
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

        if ($method == "GET" && $uri == "/api/settings/database") {
            $result = $this->gateway->createDatabaseTables();
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
            case ($method == "POST" && $uri == "/api/settings/login_image"):
                $this->gateway->updateLoginImage($data["data"]);
                http_response_code(201);
                echo json_encode([
                    "message" => "Updated",
                    "token" => $authAction["token"]
                ]);
                break;

            case ($method == "PUT" && preg_match('/^\/api\/notifications\/[0-9]*$/', $uri)):
                $this->gateway->update($data["data"], $url_parts[3]);
                echo json_encode([
                    "message" => "Updated",
                    "token" => $authAction["token"]
                ]);
                break;

            case ($method == "DELETE" && preg_match('/^\/api\/notifications\/[0-9]*$/', $uri)):
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
