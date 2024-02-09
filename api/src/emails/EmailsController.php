<?php

class EmailsController
{
    public function __construct(Database $database)
    {
        $this->gateway = new EmailsGateway($database);
    }

    public function processRequest(): void
    {
        $this->controller();
    }

    private function controller(): void
    {
        $data = json_decode(file_get_contents("php://input"), true);
        $method = $_SERVER['REQUEST_METHOD'];
        $uri = str_replace("admin/", "", $_SERVER["REQUEST_URI"]);
        $url_parts = explode("/", $uri);

        switch ($method | $uri) {
            case ($method == "POST" && $uri == "/api/emails"):
                $result = $this->gateway->sendEmail($data);

                if ($result) {
                    http_response_code(200);
                    echo json_encode("Email was sent.");
                } else {
                    http_response_code(400);
                    echo json_encode("Email was not sent.");
                }
                return;

            case ($method == "POST" && $uri == "/api/emails/subscription"):
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
