<?php

class EmailsController
{
    public function __construct(AdminGateway $adminGateway, EmailsGateway $ordersGateway)
    {
        $this->admin = $adminGateway;
        $this->gateway = $ordersGateway;
    }

    public function processRequest(string $action, ?string $id): void
    {
        $this->controller($action);
    }

    private function controller(string $action): void
    {
        $data = json_decode(file_get_contents("php://input"), true);
        $offset = 0;
        $id = 0;
        $authAction = false;

        if (isset($_GET["id"])) {
            $id = $_GET["id"];
        }
        if (isset($_SERVER["HTTP_AUTHORIZATION"])) {
            list($type, $token) = explode(" ", $_SERVER["HTTP_AUTHORIZATION"], 2);
            if (strcasecmp($type, "Bearer") == 0) {
                $authAction = $this->admin->authAction($token, array(3));
            } else {
                //echo "no bearer";
            }
        } else {
            //echo "no token";
        }

        switch ($action) {
            case 'send':
                $result = $this->gateway->sendEmail($data);

                if ($result) {
                    http_response_code(200);
                    echo json_encode("Email was sent.");
                } else {
                    http_response_code(400);
                    echo json_encode("Email was not sent.");
                }
                return;

            case 'subscribe':
                $result = $this->gateway->subscribe($data["email"]);

                if ($result) {
                    http_response_code(200);
                    echo json_encode("Subscribed");
                } else {
                    //http_response_code(400);
                    echo json_encode("Not subscribed");
                }
                return;
        }
    }
}
