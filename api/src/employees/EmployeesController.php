<?php
class EmployeesController
{
    public function __construct(Database $database)
    {
        $this->gateway = new EmployeesGateway($database);
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
            case ($method == "GET" && $uri == "/api/employees"):
                $result = $this->gateway->getAll();
                echo json_encode($result);
                return;
            case ($method == "GET" && preg_match('/^\/api\/employees\/[0-9]*$/', $uri)):
                $result = $this->gateway->get($url_parts[3]);
                echo json_encode($result);
                return;

            case ($method == "GET" && preg_match('/\/api\/employees\/\?category=[0-9]*+/', $uri) && isset($_GET["category"])):
                $department_id = $_GET["category"];
                $result = $this->gateway->getByDepartment($department_id);
                echo json_encode($result);
                return;

            case ($method == "GET" && preg_match('/\/api\/employees\/\?name=[\w%]+$/', $uri) && isset($_GET["name"])):
                $document_name = $_GET["name"];
                $result = $this->gateway->getByName($document_name);
                echo json_encode($result);
                return;

            case ($method == "GET" && preg_match('/\/api\/employees\/\?name=[\w%]+&categoryId=[\w%]+$/', $uri) && isset($_GET["name"]) && isset($_GET["categoryId"])):
                $document_name = $_GET["name"];
                $category_id = $_GET["categoryId"];
                $result = $this->gateway->getByName($document_name, $category_id);
                echo json_encode($result);
                return;

            case ($method == "GET" && $uri == "/api/employees/departments"):
                $result = $this->gateway->getDepartments();
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
            case ($method == "POST" && $uri == "/api/employees"):
                $this->gateway->create($data["data"]);
                http_response_code(201);
                echo json_encode([
                    "message" => "Employee created",
                    "token" => $authAction["token"]
                ]);
                break;
            case ($method == "PUT" && preg_match('/^\/api\/employees\/[0-9]*$/', $uri)):
                $result = $this->gateway->update($data["data"]);
                echo json_encode([
                    "message" => "Employee edited",
                    "token" => $authAction["token"]
                ]);
                break;

            case ($method == "DELETE" && preg_match('/^\/api\/employees\/[0-9]*$/', $uri)):
                $this->gateway->delete($url_parts[3]);
                echo json_encode([
                    "message" => "Employee deleted",
                    "token" => $authAction["token"]
                ]);
                break;
            case ($method == "POST" && $uri == "/api/employees/departments"):
                $id = $this->gateway->createDepartment($data);
                http_response_code(201);
                echo json_encode([
                    "message" => "Department created",
                    "data" => $id,
                    "token" => $authAction["token"]
                ]);
                break;
            case ($method == "PUT" && preg_match('/^\/api\/employees\/departments\/[0-9]*$/', $uri)):
                $id = $this->gateway->updateDepartment($data, $url_parts[4]);
                echo json_encode([
                    "message" => "Department updated",
                    "token" => $authAction["token"]
                ]);
                break;
            case ($method == "DELETE" && preg_match('/^\/api\/employees\/departments\/[0-9]*$/', $uri)):
                $this->gateway->deleteDepartment($url_parts[4]);
                echo json_encode([
                    "message" => "Department deleted",
                    "token" => $authAction["token"]
                ]);
                break;
            default:
                echo "Wrong URI";
        }
    }
}
