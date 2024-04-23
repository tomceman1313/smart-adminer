<?php

class UsersController
{
    public function __construct(Database $database)
    {
        $this->gateway = new UsersGateway($database);
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
            case ($method == "GET" && preg_match('/\/api\/users\/name\/\?name=\w*/', $uri) && isset($_GET["name"])):
                $name = $_GET["name"];
                $result = $this->gateway->checkNameAvailability($name);
                echo json_encode($result);
                return;

            case ($method == "GET" && $uri == "/api/users/roles"):
                $data = $this->gateway->getRoles();
                echo json_encode($data);
                return;
        }

        if (!$authAction) {
            http_response_code(403);
            echo json_encode([
                "message" => "Access denied"
            ]);
            return;
        }

        //API endpoints for all authenticated users
        switch ($method | $uri) {
            case ($method == "GET" && preg_match('/^\/api\/users\/roles\/[0-9]*\/permissions$/', $uri)):
                $result = $this->gateway->getRolePermissions($url_parts[4]);
                echo json_encode([
                    "data" => $result,
                    "token" => $authAction["token"]
                ]);
                return;
        }

        $isPermitted = $this->utils->checkUserAuthorization($method, $authAction["permissions"]);
        // API endpoints only for owner or permitted role
        if ((count($url_parts) > 3 ? $authAction["id"] == $url_parts[3] : false) || $isPermitted) {
            switch ($method | $uri) {
                case ($method == "GET" && preg_match('/^\/api\/users\/[0-9]*$/', $uri)):
                    $result = $this->gateway->get($url_parts[3]);
                    echo json_encode([
                        "data" => $result,
                        "token" => $authAction["token"]
                    ]);
                    return;

                case ($method == "PUT" && preg_match('/^\/api\/users\/[0-9]*$/', $uri)):
                    $this->gateway->update($data["data"], $url_parts[3]);
                    echo json_encode([
                        "message" => "User edited",
                        "token" => $authAction["token"]
                    ]);
                    return;

                case ($method == "PUT" && preg_match('/^\/api\/users\/[0-9]*\/password$/', $uri)):
                    $this->gateway->changePassword($data["data"], $url_parts[3]);
                    echo json_encode([
                        "message" => "Password change",
                        "token" => $authAction["token"]
                    ]);
                    return;
            }
        }



        if (!$isPermitted) {
            http_response_code(403);
            echo json_encode([
                "message" => "User is not permitted to this action"
            ]);
            return;
        }

        switch ($method | $uri) {
            case ($method == "GET" && $uri == "/api/users"):
                $result = $this->gateway->getAll();
                echo json_encode([
                    "message" => "Data provided",
                    "data" => $result,
                    "token" => $authAction["token"]
                ]);
                break;

            case ($method == "POST" && $uri == "/api/users"):
                $this->gateway->create($data["data"]);
                http_response_code(201);
                echo json_encode([
                    "message" => "User created",
                    "token" => $authAction["token"]
                ]);
                break;

            case ($method == "DELETE" && preg_match('/^\/api\/users\/[0-9]*$/', $uri)):
                $id = $this->gateway->delete($url_parts[3]);
                echo json_encode([
                    "message" => "User deleted",
                    "data" => $id,
                    "token" => $authAction["token"]
                ]);
                break;

            case ($method == "GET" && $uri == "/api/users/permissions"):
                $result = $this->gateway->getPermissions();
                echo json_encode([
                    "data" => $result,
                    "token" => $authAction["token"]
                ]);
                return;

            case ($method == "PUT" && preg_match('/\/api\/users\/permissions\/[0-9]*\/\?method=\w*/', $uri) && isset($_GET["method"])):
                $this->gateway->updatePermission($url_parts[4], $_GET["method"]);
                echo json_encode([
                    "message" => "Permission updated",
                    "token" => $authAction["token"]
                ]);
                return;

            default:
                echo "Wrong URI";
        }
    }
}
