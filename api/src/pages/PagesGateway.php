<?php

class PagesGateway
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
        $sql = "SELECT * FROM pages";
        $stmt = $this->conn->query($sql);

        $data = [];
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $sql_config = "SELECT * FROM pages_config WHERE page_id = :page_id LIMIT 1";
            $stmt_config = $this->conn->prepare($sql_config);
            $stmt_config->execute([
                'page_id' => $row["id"]
            ]);

            $page_config = $stmt_config->fetch(PDO::FETCH_ASSOC);
            $row["config"] = $page_config;

            $data[] = $row;
        }

        return $data;
    }

    public function get(string $name): array
    {
        $sql = "SELECT * FROM pages WHERE name = :name LIMIT 1";
        $stmt = $this->conn->prepare($sql);

        $stmt->execute([
            'name' => $name
        ]);

        $data = $stmt->fetch(PDO::FETCH_ASSOC);

        $sql_config = "SELECT * FROM pages_config WHERE page_id = :page_id LIMIT 1";
        $stmt_config = $this->conn->prepare($sql_config);
        $stmt_config->execute([
            'page_id' => $data["id"]
        ]);

        $page_config = $stmt_config->fetch(PDO::FETCH_ASSOC);
        $data["config"] = $page_config;
        return $data;
    }

    public function getAllPageParts(string $page): array
    {
        $sql = "SELECT * FROM pages WHERE page_name = :page_name";
        $stmt = $this->conn->prepare($sql);

        $stmt->execute([
            'page_name' => $page
        ]);

        $data = [];
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $data[$row["name"]] = $row;
        }

        return $data;
    }

    public function update(array $data, $id)
    {
        $sql = "UPDATE pages SET title = :title, description = :description, body = :body";
        $sql_values = [
            'title' => isset($data["title"]) ? $data["title"] : "",
            'description' => isset($data["description"]) ? $data["description"] : "",
            'body' => $data["body"],
            'id' => $id,
        ];

        if (!empty($data["prev_image"])) {
            if (file_exists("{$this->path}/images/pages/{$data["prev_image"]}")) {
                unlink("{$this->path}/images/pages/{$data["prev_image"]}");
            }
        }

        if (!empty($data["image"])) {
            $image_name = $this->utils->createImage($data["image"], 1200, "/images/pages");
            $sql .= ", image = :image";
            $sql_values['image'] = $image_name;
        }

        $sql .= " WHERE id = :id";
        $stmt = $this->conn->prepare($sql);

        $stmt->execute($sql_values);

        $innerImages = $data["inner_images"];
        foreach ($innerImages as $image) {
            $this->createImage($image["name"], $image["file"], $id);
        }

        if (isset($data["deleted_images"])) {
            $deletedImages = $data["deleted_images"];
            foreach ($deletedImages as $image) {
                $this->deleteImage($image);
            }
        }
    }

    private function createImage($name, $base64, $page_id)
    {
        $image_name = $this->utils->createImage($base64, 1200, "/images/pages", $name);

        $sql = "INSERT INTO page_images (name, page_id) VALUES (:name, :page_id)";
        $stmt = $this->conn->prepare($sql);

        $stmt->execute([
            'name' => $image_name,
            'page_id' => $page_id
        ]);
    }

    public function deleteImage($image_name)
    {
        $sql = "DELETE FROM page_images WHERE name = :name";
        $stmt = $this->conn->prepare($sql);

        $stmt->execute([
            'name' => $image_name
        ]);

        if (file_exists("{$this->path}/images/pages/{$image_name}")) {
            unlink("{$this->path}/images/pages/{$image_name}");
        }
    }
}
