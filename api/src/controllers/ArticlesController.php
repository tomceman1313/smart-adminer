<?php
class ArticlesConroller
{
    public function __construct(ArticlesGateway $gateway)
    {
        $this->gateway = $gateway;
    }


    public function processRequest(string $action, ?string $id): void
    {
        $this->controller($action);
    }

    private function controller(string $action): void
    {
        switch ($action) {
            case 'getall':
                echo json_encode($this->gateway->getAll());
                break;
            case 'create':
                $data = json_decode(file_get_contents("php://input"), true);
                $result = $this->gateway->create($data);

                if ($result) {
                    http_response_code(201);
                    echo json_encode([
                        "message" => "Article created"
                    ]);
                } else {
                    http_response_code(400);
                    echo json_encode([
                        "message" => "Insert failure"
                    ]);
                }
                break;
            case 'update':
                $data = json_decode(file_get_contents("php://input"), true);
                $result = $this->gateway->update($data);

                if ($result) {
                    http_response_code(200);
                    echo json_encode([
                        "message" => "Article edited"
                    ]);
                } else {
                    http_response_code(400);
                    echo json_encode([
                        "message" => "Update failure"
                    ]);
                }
                break;
            case 'delete':
                $data = json_decode(file_get_contents("php://input"), true);
                $result = $this->gateway->delete($data["id"]);
                if ($result) {
                    http_response_code(200);
                    echo json_encode([
                        "message" => "Article deleted"
                    ]);
                } else {
                    http_response_code(400);
                    echo json_encode([
                        "message" => "Delete failure"
                    ]);
                }
                break;

            case 'upload':
                $pic = $_FILES['image']['name'];
                $pic_tem_loc = $_FILES['image']['tmp_name'];
                $pic_store = "/public/images/" . $pic;

                $result = move_uploaded_file($pic_tem_loc, $pic_store);
                if ($result) {
                    http_response_code(200);
                    echo json_encode([
                        "message" => "Article deleted"
                    ]);
                } else {
                    http_response_code(400);
                    echo json_encode([
                        "message" => "Delete failure",
                        "code" => $result
                    ]);
                }
            default:
                break;
        }
    }
}
