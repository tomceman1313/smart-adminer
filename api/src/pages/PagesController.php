<?php
class PagesController
{
    public function __construct(Database $database)
    {
        $this->gateway = new PagesGateway($database);
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

        switch ($method | $uri) {
            case ($method == "GET" && $uri == "/api/pages"):
                $result = $this->gateway->getAll();
                echo json_encode($result);
                return;

            case ($method == "GET" && preg_match('/\/api\/pages\/[\w_%]*\/parts/', $uri)):
                $result = $this->gateway->getAllPageParts(urldecode($url_parts[3]));
                echo json_encode($result);
                return;

            case ($method == "GET" && preg_match('/\/api\/pages\/\?name=\w*/', $uri) && isset($_GET["name"])):
                $result = $this->gateway->get($_GET["name"]);
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
            case ($method == "PUT" && preg_match('/^\/api\/pages\/[0-9]*$/', $uri)):
                $this->gateway->update($data["data"], $url_parts[3]);
                echo json_encode([
                    "message" => "Updated",
                    "token" => $authAction["token"]
                ]);
                break;

            default:
                echo "Wrong URI";
        }
    }
}
