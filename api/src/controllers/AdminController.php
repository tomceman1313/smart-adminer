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
        switch ($action) {
            case 'getall':
                $data = json_decode(file_get_contents("php://input"), true);
                $authAction = $this->gateway->authAction($data["token"], array(3));
                if (!$authAction) {
                    http_response_code(403);
                    echo json_encode([
                        "message" => "Access denied"
                    ]);
                } else {
                    $result = $this->gateway->getAll();
                    http_response_code(200);
                    echo json_encode([
                        "message" => "Data provided",
                        "data" => $result,
                        "token" => $authAction
                    ]);
                }
                break;

            case 'get':
                $data = json_decode(file_get_contents("php://input"), true);
                $authAction = $this->gateway->authAction($data["token"], array(3));
                if (!$authAction) {
                    http_response_code(403);
                    echo json_encode([
                        "message" => "Access denied"
                    ]);
                } else {
                    $result = $this->gateway->get($data["id"]);
                    http_response_code(200);
                    echo json_encode([
                        "message" => "Data provided",
                        "data" => $result,
                        "token" => $authAction
                    ]);
                }
                break;

            case 'verify':
                $data = json_decode(file_get_contents("php://input"), true);
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
                break;

            case 'create':
                $data = json_decode(file_get_contents("php://input"), true);
                $authAction = $this->gateway->authAction($data["token"], array(3));
                if (!$authAction) {
                    http_response_code(403);
                    echo json_encode([
                        "message" => "Access denied"
                    ]);
                } else {
                    $id = $this->gateway->create($data["data"]);
                    http_response_code(201);
                    echo json_encode([
                        "message" => "User created",
                        "data" => $id,
                        "token" => $authAction
                    ]);
                }
                break;

            case 'update':
                $data = json_decode(file_get_contents("php://input"), true);
                $current = $this->gateway->get($data['data']["id"]);
                $authAction = $this->gateway->authAction($data["token"], array(3));
                if (!$authAction) {
                    http_response_code(403);
                    echo json_encode([
                        "message" => "Access denied"
                    ]);
                } else {
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
                }

                break;
            case 'delete':
                $data = json_decode(file_get_contents("php://input"), true);
                $authAction = $this->gateway->authAction($data["token"], array(3));
                if (!$authAction) {
                    http_response_code(403);
                    echo json_encode([
                        "message" => "Access denied"
                    ]);
                } else {
                    $id = $this->gateway->delete($data["id"]);
                    http_response_code(200);
                    echo json_encode([
                        "message" => "User deleted",
                        "data" => $id,
                        "token" => $authAction
                    ]);
                }
                break;

            case 'getroles':
                $data = json_decode(file_get_contents("php://input"), true);
                $authAction = $this->gateway->authAction($data["token"], array(3));
                if (!$authAction) {
                    http_response_code(403);
                    echo json_encode([
                        "message" => "Access denied"
                    ]);
                } else {
                    $response = $this->gateway->getRoles();
                    http_response_code(200);
                    echo json_encode([
                        "message" => "Data provided",
                        "data" => $response,
                        "token" => $authAction
                    ]);
                }
                break;

            case 'update_role':
                $data = json_decode(file_get_contents("php://input"), true);
                $authAction = $this->gateway->authAction($data["token"], array(3));
                if (!$authAction) {
                    http_response_code(403);
                    echo json_encode([
                        "message" => "Access denied"
                    ]);
                } else {
                    $response = $this->gateway->updateRole($data["data"]);
                    http_response_code(200);
                    echo json_encode([
                        "message" => "Role updated",
                        "data" => $response,
                        "token" => $authAction
                    ]);
                }


                break;
            case 'auth':
                $data = json_decode(file_get_contents("php://input"), true);
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
                break;

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
                break;

            case 'logout':
                // header("Access-Control-Allow-Origin: http://localhost:3000");
                // header("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
                // header("Content-type: application/json; charset=UTF-8");
                // header("Access-Control-Allow-Methods: GET, PUT, POST, PATCH, DELETE, HEAD");
                // header("Access-Control-Allow-Credentials: true");

                setcookie("refresh_token", null, -1, '/', null, false, true);
                http_response_code(200);
                break;

            case 'test':
                sleep(5);
                echo json_encode([
                    "result" => "Sleeping for five seconds",
                    "token" => $_COOKIE["refresh_token"]
                ]);
                break;
            default:
                break;
        }
    }
}
