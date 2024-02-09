<?php

class VacanciesGateway
{
    public function __construct(Database $database)
    {
        $this->conn = $database->getConnection();
        include(dirname(__FILE__) . '/../publicFolderPath.php');
        $this->utils = new Utils($database);
        $this->path = $path;
    }

    function getAll(): array
    {
        $sql = "SELECT * FROM vacancies";
        $stmt = $this->conn->query($sql);

        $data = [];
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $data[] = $row;
        }

        return $data;
    }

    public function get($id)
    {
        $sql = "SELECT * FROM vacancies WHERE id = :id LIMIT 1";
        $stmt = $this->conn->prepare($sql);

        $stmt->execute([
            'id' => $id
        ]);

        $data = $stmt->fetch(PDO::FETCH_ASSOC);
        return $data;
    }

    public function create(array $data)
    {
        $image_name = $this->utils->createImage($data["image"], 1200, "/images/vacancies");

        $sql = "INSERT INTO vacancies (title, description, detail, date, active, image) VALUES (:title, :description, :detail, :date, :active, :image)";
        $stmt = $this->conn->prepare($sql);

        $stmt->execute([
            'title' => $data["title"],
            'description' => $data["description"],
            'detail' => $data["detail"],
            'date' => $data["date"],
            'active' => $data["active"],
            'image' => $image_name
        ]);
    }

    public function update(array $data)
    {
        $sql = "UPDATE vacancies SET title = :title, description = :description, detail = :detail,
        date = :date, active = :active";

        $sql_values = [
            'title' => $data["title"],
            'description' => $data["description"],
            'detail' => $data["detail"],
            'date' => $data["date"],
            'active' => $data["active"],
            'id' => $data["id"]
        ];

        if (isset($data["image"])) {
            $image_name = $this->utils->createImage($data["image"], 1200, "/images/vacancies");

            if (file_exists("{$this->path}/images/vacancies/{$data["previous_image"]}")) {
                unlink("{$this->path}/images/vacancies/{$data["previous_image"]}");
            }
            $sql = $sql . ", image = :image";
            $sql_values["image"] = $image_name;
        }

        $sql = $sql . " WHERE id = :id";
        $stmt = $this->conn->prepare($sql);
        $stmt->execute($sql_values);
    }

    public function delete($id)
    {
        $vacancy = $this->get($id);

        if (!$vacancy) {
            return false;
        }

        $imageName = $vacancy["image"];

        if (file_exists("{$this->path}/images/vacancies/{$imageName}")) {
            unlink("{$this->path}/images/vacancies/{$imageName}");
        }

        $sql = "DELETE FROM vacancies WHERE id = :id";
        $stmt = $this->conn->prepare($sql);
        $stmt->bindValue(":id", $id, PDO::PARAM_INT);
        $stmt->execute();


        return true;
    }
}
