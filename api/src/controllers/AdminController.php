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

        switch ($action) {
            case 'getall':

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
                setcookie("refresh_token", "", -1, '/', "", false, true);
                http_response_code(200);
                break;

            case 'change_password':

                $authAction = $this->gateway->authAction($data["token"], array(1, 2, 3));
                if (!$authAction) {
                    http_response_code(403);
                    echo json_encode([
                        "message" => "Access denied"
                    ]);
                } else {
                    $response = $this->gateway->changePassword($data["data"]);
                    http_response_code(200);
                    echo json_encode([
                        "message" => "Password change",
                        "success" => $response,
                        "token" => $authAction
                    ]);
                }
                break;

            case 'test':
                if (!isset($_COOKIE["refresh_token"])) {
                    echo "nothing";
                } else {
                    echo $_COOKIE["refresh_token"];
                }
                break;
            default:
                break;
        }
    }
}
