<?php

class AdminController
{
    public function __construct(AdminGateway $gateway)
    {
        $this->gateway = $gateway;
    }


    public function processRequest(string $action, ?string $id): void
    {
        $this->userControl($action);
    }

    private function userControl(string $action): void
    {
        $data = json_decode(file_get_contents("php://input"), true);
        $offset = 0;
        $id = 0;
        $authAction = false;

        if (isset($_GET["offset"])) {
            $offset = $_GET["offset"];
        }
        if (isset($_GET["id"])) {
            $id = $_GET["id"];
        }
        if (isset($_SERVER["HTTP_AUTHORIZATION"])) {
            list($type, $token) = explode(" ", $_SERVER["HTTP_AUTHORIZATION"], 2);
            if (strcasecmp($type, "Bearer") == 0) {
                $authAction = $this->gateway->authAction($token, array(3));
            } else {
                //echo "no bearer";
            }
        } else {
            //echo "no token";
        }

        switch ($action) {
            case 'auth':
                $response = $this->gateway->auth($data);
                http_response_code(200);
                if ($response != "wrong") {
                    echo json_encode([
                        "message" => "access",
                        "token" => $response["token"],
                        "username" => $response["username"],
                        "role" => $response["role"],
                        "id" => $response["id"]
                    ]);
                } else {
                    echo json_encode([
                        "message" => "wrong"
                    ]);
                }
                return;

            case 'refresh':
                $response = $this->gateway->refresh();
                if ($response != false) {
                    http_response_code(200);
                    echo json_encode([
                        "message" => "refreshed",
                        "user" => $response
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

            case 'verify':
                $result = $this->gateway->checkUser($data);
                if ($result) {
                    http_response_code(201);
                    echo json_encode([
                        "message" => "success"
                    ]);
                } else {
                    http_response_code(200);
                    echo json_encode([
                        "message" => "wrong"
                    ]);
                }
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
            case 'getall':
                $result = $this->gateway->getAll();
                http_response_code(200);
                echo json_encode([
                    "message" => "Data provided",
                    "data" => $result,
                    "token" => $authAction
                ]);
                break;

            case 'get':
                $result = $this->gateway->get($data["id"]);
                http_response_code(200);
                echo json_encode([
                    "message" => "Data provided",
                    "data" => $result,
                    "token" => $authAction
                ]);
                break;

            case 'create':
                $id = $this->gateway->create($data["data"]);
                http_response_code(201);
                echo json_encode([
                    "message" => "User created",
                    "data" => $id,
                    "token" => $authAction
                ]);
                break;

            case 'update':
                $current = $this->gateway->get($data['data']["id"]);
                $result = $this->gateway->update($current, $data["data"]);
                if ($result) {
                    http_response_code(200);
                    echo json_encode([
                        "message" => "User edited",
                        "token" => $authAction
                    ]);
                } else {
                    http_response_code(400);
                    echo json_encode([
                        "message" => "Update failure",
                        "token" => $authAction
                    ]);
                }
                break;

            case 'delete':
                $id = $this->gateway->delete($id);
                http_response_code(200);
                echo json_encode([
                    "message" => "User deleted",
                    "data" => $id,
                    "token" => $authAction
                ]);
                break;

            case 'getroles':
                $response = $this->gateway->getRoles();
                http_response_code(200);
                echo json_encode([
                    "message" => "Data provided",
                    "data" => $response,
                    "token" => $authAction
                ]);
                break;

            case 'update_role':
                $response = $this->gateway->updateRole($data["data"]);
                http_response_code(200);
                echo json_encode([
                    "message" => "Role updated",
                    "data" => $response,
                    "token" => $authAction
                ]);
                break;

            case 'change_password':
                $response = $this->gateway->changePassword($data["data"]);
                http_response_code(200);
                echo json_encode([
                    "message" => "Password change",
                    "success" => $response,
                    "token" => $authAction
                ]);
                break;
        }
    }
}
