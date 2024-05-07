<?php

class EmployeesGateway
{
    public function __construct(Database $database)
    {
        $this->conn = $database->getConnection();
        include(dirname(__FILE__) . '/../publicFolderPath.php');
        $this->path = $path;
        $this->utils = new Utils($database);
    }

    function getAll(): array
    {
        $sql = "SELECT * FROM employees ORDER BY lname";
        $stmt = $this->conn->query($sql);

        $departments = $this->getDepartments();

        $data = [];
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $row["departments"] = $this->getEmployeeDepartments($row["id"], $departments);
            $data[] = $row;
        }

        return $data;
    }

    public function get($id)
    {
        $sql = "SELECT * FROM employees WHERE id = :id LIMIT 1";
        $stmt = $this->conn->prepare($sql);
        $stmt->execute([
            'id' => $id
        ]);

        $data = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$data) {
            return null;
        }

        $departments = $this->getDepartments();
        $data["departments"] = $this->getEmployeeDepartments($id, $departments);
        return $data;
    }

    public function getByDepartment(string $department_id): array
    {
        $sql = "SELECT employees.* FROM employees INNER JOIN employee_department AS dep ON employees.id = dep.employee_id WHERE dep.department_id = :department_id";

        $stmt = $this->conn->prepare($sql);
        $stmt->execute([
            'department_id' => $department_id
        ]);

        $departments = $this->getDepartments();

        $data = [];
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $row["departments"] = $this->getEmployeeDepartments($row["id"], $departments);
            $data[] = $row;
        }

        return $data;
    }

    public function getByName(string $name, int $department_id = NULL): array
    {
        $sql_values = [
            'fname' => "%" . $name . "%",
            'lname' => "%" . $name . "%"
        ];

        if ($department_id) {
            $sql = "SELECT employees.* FROM employees INNER JOIN employee_department AS dep ON employees.id = dep.employee_id WHERE dep.department_id = :department_id  AND (lname LIKE :lname OR fname LIKE :fname)";
            $sql_values["department_id"] = $department_id;
        } else {
            $sql = "SELECT * FROM employees WHERE lname LIKE :lname OR fname LIKE :fname";
        }

        $stmt = $this->conn->prepare($sql);
        $stmt->execute($sql_values);

        $departments = $this->getDepartments();

        $data = [];
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $row["departments"] = $this->getEmployeeDepartments($row["id"], $departments);
            $data[] = $row;
        }

        return $data;
    }

    public function create(array $data)
    {
        $image_name = "";
        if (isset($data["image"])) {
            $image_name = $this->utils->createImage($data["image"], 600, "/images/employees");
        }

        $sql = "INSERT INTO employees (fname, lname, degree_before, degree_after, position, phone, phone_secondary, email, image, notes, active) 
        VALUES (:fname, :lname, :degree_before, :degree_after, :position, :phone, :phone_secondary, :email, :image, :notes, :active)";
        $stmt = $this->conn->prepare($sql);

        $stmt->execute([
            'fname' => $data["fname"],
            'lname' => $data["lname"],
            'degree_before' => $data["degree_before"],
            'degree_after' => $data["degree_after"],
            'position' => $data["position"],
            'phone' => $data["phone"],
            'phone_secondary' => $data["phone_secondary"],
            'email' => $data["email"],
            'image' => $image_name,
            'notes' => $data["notes"],
            'active' => $data["active"],
        ]);

        $last_id = $this->conn->lastInsertId();
        $this->addEmployeeDepartments($last_id, $data["departments"]);
    }

    public function update(array $data)
    {
        $sql = "UPDATE employees SET fname = :fname, lname = :lname, degree_before = :degree_before,
                degree_after = :degree_after, position = :position, phone = :phone, phone_secondary = :phone_secondary, email = :email, notes = :notes, active = :active";

        $sql_values = [
            'fname' => $data["fname"],
            'lname' => $data["lname"],
            'degree_before' => $data["degree_before"],
            'degree_after' => $data["degree_after"],
            'position' => $data["position"],
            'phone' => $data["phone"],
            'phone_secondary' => $data["phone_secondary"],
            'email' => $data["email"],
            'notes' => $data["notes"],
            'active' => $data["active"],
            'id' => $data["id"],
        ];

        if (isset($data["deleted_image"]) && file_exists("{$this->path}/images/employees/{$data["deleted_image"]}")) {
            unlink("{$this->path}/images/employees/{$data["deleted_image"]}");
            $sql = $sql . ", image = :image";
            $sql_values['image'] = "";
        }

        if (isset($data["image"])) {
            $image_name = $this->utils->createImage($data["image"], 600, "/images/employees/");

            if (file_exists("{$this->path}/images/employees/{$data["previous_image"]}")) {
                unlink("{$this->path}/images/employees/{$data["previous_image"]}");
            }
            $sql = $sql . ", image = :image";
            $sql_values['image'] = $image_name;
        }

        $sql = $sql . " WHERE id = :id";
        $stmt = $this->conn->prepare($sql);
        $stmt->execute($sql_values);

        $this->addEmployeeDepartments($data["id"], $data["departments"]);
        $this->deleteEmployeeDepartments($data["id"], $data["departments_deleted"]);
    }

    public function delete($id)
    {
        $employee = $this->get($id);

        if (!$employee) {
            return false;
        }

        $imageName = $employee["image"];

        if (file_exists("{$this->path}/images/employees/{$imageName}")) {
            unlink("{$this->path}/images/employees/{$imageName}");
        }

        $sql = "DELETE FROM employees WHERE id = :id";
        $stmt = $this->conn->prepare($sql);
        $stmt->bindValue(":id", $id, PDO::PARAM_INT);
        $stmt->execute();

        $sql = "DELETE FROM employee_department WHERE employee_id = :employee_id";
        $stmt = $this->conn->prepare($sql);

        $stmt->execute([
            'employee_id' => $id,
        ]);

        return true;
    }

    public function getDepartments(): array
    {
        $sql = "SELECT * FROM employees_departments";
        $stmt = $this->conn->query($sql);

        $data = [];
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $data[] = $row;
        }

        return $data;
    }

    public function createDepartment($data)
    {
        $sql = "INSERT INTO employees_departments (name) VALUES (:name)";
        $stmt = $this->conn->prepare($sql);

        $stmt->execute([
            'name' => $data["name"]
        ]);

        return $this->conn->lastInsertId();
    }

    public function updateDepartment($data, $id)
    {
        $sql = "UPDATE employees_departments SET name = :name WHERE id = :id";
        $stmt = $this->conn->prepare($sql);

        $stmt->execute([
            'name' => $data["name"],
            'id' => $id
        ]);
    }

    public function deleteDepartment($id)
    {
        //delete department
        $sql = "DELETE FROM employees_departments WHERE id = :id";
        $stmt = $this->conn->prepare($sql);
        $stmt->bindValue(":id", $id, PDO::PARAM_INT);
        $stmt->execute();

        //delete employee_department
        $sql = "DELETE FROM employee_department WHERE department_id = :department_id";
        $stmt = $this->conn->prepare($sql);

        $stmt->execute([
            'department_id' => $id,
        ]);
    }

    private function getEmployeeDepartments($id, $departments): array
    {
        $sql_categories = "SELECT department_id FROM employee_department WHERE employee_id = :id";
        $stmt = $this->conn->prepare($sql_categories);
        $stmt->execute([
            'id' => $id
        ]);

        $data = [];
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            foreach ($departments as $value) {
                if ($row["department_id"] == $value["id"]) {
                    $row["name"] = $value["name"];
                }
            }
            $data[] = $row;
        }

        return $data;
    }

    private function addEmployeeDepartments($id, $departments): void
    {
        $departments = $departments;
        $sql_new_dep = "INSERT INTO employee_department (employee_id, department_id) VALUES (:employee_id, :department_id)";
        foreach ($departments as $item) {
            $stmt = $this->conn->prepare($sql_new_dep);
            $stmt->execute([
                'employee_id' => $id,
                'department_id' => $item["id"]
            ]);
        }
    }

    private function deleteEmployeeDepartments($id, $departments_deleted): void
    {
        foreach ($departments_deleted as $item) {
            $sql = "DELETE FROM employee_department WHERE employee_id = :employee_id AND department_id = :department_id";
            $stmt = $this->conn->prepare($sql);

            $stmt->execute([
                'employee_id' => $id,
                'department_id' => $item,
            ]);
        }
    }
}
