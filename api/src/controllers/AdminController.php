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
            case 'show':
                echo json_encode($this->gateway->getAll());
                break;
            case 'get':
                $id = json_decode(file_get_contents("php://input"), true);
                echo json_encode($this->gateway->get($id["id"]));
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
                $id = $this->gateway->create($data);

                http_response_code(201);
                echo json_encode([
                    "message" => "User created",
                    "id" => $id
                ]);

                break;
            case 'edit':
                $data = json_decode(file_get_contents("php://input"), true);
                $current = $this->gateway->get($data['id']);
                $id = $this->gateway->update($current, $data);

                http_response_code(201);
                echo json_encode([
                    "message" => "User edited",
                    "id" => $id
                ]);

                break;
            case 'delete':
                $data = json_decode(file_get_contents("php://input"), true);
                //echo json_encode($this->gateway->checkUser($data));
                $this->gateway->delete($data["id"]);
                http_response_code(201);
                echo json_encode([
                    "message" => "User deleted"
                ]);
                break;

            case 'getroles':
                echo json_encode($this->gateway->getRoles());
                break;

            case 'update_role':
                $data = json_decode(file_get_contents("php://input"), true);
                $response = $this->gateway->updateRole($data);
                http_response_code(201);
                echo json_encode([
                    "message" => $response
                ]);
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
                        "role" => $response["role"]
                    ]);
                } else {
                    echo json_encode([
                        "message" => "wrong"
                    ]);
                }
                break;

            case 'refresh':
                //$data = json_decode(file_get_contents("php://input"), true);
                $response = $this->gateway->refresh();
                if ($response != false) {
                    http_response_code(200);
                    echo json_encode([
                        "message" => "refreshed",
                        "token" => $response
                    ]);
                } else {
                    http_response_code(403);
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
            default:
                break;
        }
    }
}
