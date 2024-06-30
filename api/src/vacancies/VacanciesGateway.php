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
        $sql = "SELECT * FROM vacancies ORDER BY position";
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
        $sql = "SELECT COUNT(*) FROM vacancies";
        $stmt = $this->conn->query($sql);
        $position = $stmt->fetch(PDO::FETCH_ASSOC);
        //indexing from 1 not 0
        $position = $position["COUNT(*)"] + 1;

        $image_name = $this->utils->createImage($data["image"], 1200, "/images/vacancies");

        $sql = "INSERT INTO vacancies (title, description, detail, date, active, image, position) VALUES (:title, :description, :detail, :date, :active, :image, :position)";
        $stmt = $this->conn->prepare($sql);

        $stmt->execute([
            'title' => $data["title"],
            'description' => $data["description"],
            'detail' => $data["detail"],
            'date' => $data["date"],
            'active' => $data["active"],
            'image' => $image_name,
            'position' => $position
        ]);
    }

    public function update(array $data, $id)
    {
        $sql = "UPDATE vacancies SET title = :title, description = :description, detail = :detail,
        date = :date, active = :active";

        $sql_values = [
            'title' => $data["title"],
            'description' => $data["description"],
            'detail' => $data["detail"],
            'date' => $data["date"],
            'active' => $data["active"],
            'id' => $id
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

    public function updateOrder(array $data)
    {
        $sql_select = "SELECT id, position FROM vacancies WHERE id = :id LIMIT 1";
        $sql_update = "UPDATE vacancies SET position = :position WHERE id = :id";

        $position = 1;
        foreach ($data["ids"] as $id) {
            $stmt = $this->conn->prepare($sql_select);
            $stmt->execute([
                'id' => $id,
            ]);

            $result = $stmt->fetch(PDO::FETCH_ASSOC);
            //var_dump($result);
            if ($result["position"] !== $position) {
                $stmt = $this->conn->prepare($sql_update);

                $stmt->execute([
                    'position' => $position,
                    'id' => $id
                ]);
            }



            ++$position;
        }
    }
}
