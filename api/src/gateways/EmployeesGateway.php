<?php

class EmployeesGateway
{
    public function __construct(Database $database)
    {
        $this->conn = $database->getConnection();
        include(dirname(__FILE__) . '/../publicFolderPath.php');
        $this->path = $path;
    }

    function getAll(): array
    {
        $sql = "SELECT * FROM employees";
        $stmt = $this->conn->query($sql);

        $data = [];
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
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
        return $data;
    }

    public function create(array $data)
    {
        $base64DataString = $data["image"];
        list($dataType, $imageData) = explode(';', $base64DataString);

        // image file extension
        $imageExtension = explode('/', $dataType)[1];
        // base64-encoded image data
        list(, $encodedImageData) = explode(',', $imageData);
        // decode base64-encoded image data
        $decodedImageData = base64_decode($encodedImageData);
        // save image data as file
        $image_name = uniqid();
        file_put_contents("{$this->path}/images/employees/{$image_name}.{$imageExtension}", $decodedImageData);

        $this->compress($image_name . "." . $imageExtension);

        $sql = "INSERT INTO employees (fname, lname, degree_before, degree_after, department, position, phone, email, image, notes) 
        VALUES (:fname, :lname, :degree_before, :degree_after, :department, :position, :phone, :email, :image, :notes)";
        $stmt = $this->conn->prepare($sql);

        $stmt->execute([
            'fname' => $data["fname"],
            'lname' => $data["lname"],
            'degree_before' => $data["degree_before"],
            'degree_after' => $data["degree_after"],
            'department' => $data["department"],
            'position' => $data["position"],
            'phone' => $data["phone"],
            'email' => $data["email"],
            'image' => $image_name . "." . $imageExtension,
            'notes' => $data["notes"],
        ]);
    }

    public function update(array $data, $id): bool
    {
        if (isset($data["image"])) {
            $base64DataString = $data["image"];
            list($dataType, $imageData) = explode(';', $base64DataString);
            // image file extension
            $imageExtension = explode('/', $dataType)[1];
            // base64-encoded image data
            list(, $encodedImageData) = explode(',', $imageData);
            // decode base64-encoded image data
            $decodedImageData = base64_decode($encodedImageData);
            // save image data as file
            $image_name = uniqid();
            file_put_contents("{$this->path}/images/employees/{$image_name}.{$imageExtension}", $decodedImageData);
            $this->compress($image_name . "." . $imageExtension);

            if (file_exists("{$this->path}/images/employees/{$data["previous_image"]}")) {
                unlink("{$this->path}/images/employees/{$data["previous_image"]}");
            }

            $sql = "UPDATE employees SET fname = :fname, lname = :lname, degree_before = :degree_before,
                degree_after = :degree_after, department = :department, position = :position, phone = :phone, email = :email, notes = :notes, image = :image WHERE id = :id";

            $stmt = $this->conn->prepare($sql);

            $stmt->execute([
                'fname' => $data["fname"],
                'lname' => $data["lname"],
                'degree_before' => $data["degree_before"],
                'degree_after' => $data["degree_after"],
                'department' => $data["department"],
                'position' => $data["position"],
                'phone' => $data["phone"],
                'email' => $data["email"],
                'image' => $image_name . "." . $imageExtension,
                'notes' => $data["notes"],
                'id' => $data["id"],
            ]);
        }

        $sql = "UPDATE employees SET fname = :fname, lname = :lname, degree_before = :degree_before,
        degree_after = :degree_after, department = :department, position = :position, phone = :phone, email = :email, notes = :notes WHERE id = :id";

        $stmt = $this->conn->prepare($sql);

        $stmt->execute([
            'fname' => $data["fname"],
            'lname' => $data["lname"],
            'degree_before' => $data["degree_before"],
            'degree_after' => $data["degree_after"],
            'department' => $data["department"],
            'position' => $data["position"],
            'phone' => $data["phone"],
            'email' => $data["email"],
            'notes' => $data["notes"],
            'id' => $data["id"],
        ]);

        return true;
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


        return true;
    }

    private function compress($imageName)
    {
        $source = "{$this->path}/images/employees/{$imageName}";
        // $quality = 75;
        set_time_limit(10);
        do {
            if (file_exists($source)) {
                $info = getimagesize($source);
                $width = $info[0];
                $height = $info[1];

                if ($info['mime'] == 'image/jpeg')
                    $image = imagecreatefromjpeg($source);

                elseif ($info['mime'] == 'image/gif')
                    $image = imagecreatefromgif($source);

                elseif ($info['mime'] == 'image/png')
                    $image = imagecreatefrompng($source);

                if ($width > 750) {
                    $aspectRatio = $width / $height;
                    $imageResized = imagescale($image, 750, 750 / $aspectRatio);
                } else {
                    $imageResized = $image;
                }

                imagejpeg($imageResized, $source);
                break;
            }
        } while (true);
    }

    public function getDepartments(): array
    {
        $sql = "SELECT * FROM employees";
        $stmt = $this->conn->query($sql);

        $data = [];
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $data[] = $row;
        }

        return $data;
    }

    public function createDepartment(array $data)
    {
        $sql = "INSERT INTO employees_departments (name) VALUES (name)";
        $stmt = $this->conn->prepare($sql);

        $stmt->execute([
            'name' => $data["name"]
        ]);
    }

    public function deleteDepartment($id)
    {
        //delete department
        $sql = "DELETE FROM employees_departments WHERE id = :id";
        $stmt = $this->conn->prepare($sql);
        $stmt->bindValue(":id", $id, PDO::PARAM_INT);
        $stmt->execute();

        //delete employees
        $sql = "DELETE FROM employees WHERE department = :department";
        $stmt = $this->conn->prepare($sql);

        $stmt->execute([
            'department' => $id,
        ]);


        return true;
    }
}
