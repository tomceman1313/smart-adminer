<?php

class EmailsController
{
    public function __construct(EmailsGateway $ordersGateway)
    {
        $this->gateway = $ordersGateway;
    }

    public function processRequest(string $action): void
    {
        $this->controller($action);
    }

    private function controller(string $action): void
    {
        $data = json_decode(file_get_contents("php://input"), true);

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
