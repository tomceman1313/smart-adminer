<?php

class EventsGateway
{
    public function __construct(Database $database)
    {
        $this->conn = $database->getConnection();
        include(dirname(__FILE__) . '/../publicFolderPath.php');
        $this->utils = new Utils($database);
        $this->path = $path;
    }

    public function get(string $id): array
    {
        $sql = "SELECT * FROM events WHERE id = :id LIMIT 1";
        $stmt = $this->conn->prepare($sql);

        $stmt->execute([
            'id' => $id
        ]);

        $data = $stmt->fetch(PDO::FETCH_ASSOC);

        $sql = "SELECT id, name FROM event_images WHERE event_id = :id AND type = 'under'";
        $stmt = $this->conn->prepare($sql);

        $stmt->execute([
            'id' => $id
        ]);

        $images = [];
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $images[] = $row;
        }
        $data["images"] = $images;
        return $data;
    }

    public function getByCategory(string $category_id): array
    {
        $sql = "SELECT * FROM events WHERE category = :id";
        $stmt = $this->conn->prepare($sql);

        $stmt->execute([
            'id' => $category_id
        ]);

        $data = [];
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $data[] = $row;
        }

        return $data;
    }

    function getAll(): array
    {
        $sql = "SELECT * FROM events ORDER BY date DESC";
        $stmt = $this->conn->query($sql);

        $data = [];
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $data[] = $row;
        }

        return $data;
    }

    public function create(array $data, int $userId)
    {
        $image_name = $this->utils->createImage($data["image"], 1200, "/images/events");

        $sql = "INSERT INTO events (title, description, image, body, date, category, owner_id, active) VALUES (:title, :description, :image, :body, :date, :category, :owner_id, :active)";
        $stmt = $this->conn->prepare($sql);

        $stmt->execute([
            'title' => $data["title"],
            'description' => $data["description"],
            'image' => $image_name,
            'body' => $data["body"],
            'date' => $data["date"],
            'category' => $data["category"],
            'owner_id' => $userId,
            'active' => $data["active"]
        ]);

        $last_id = $this->conn->lastInsertId();

        $innerImages = $data["innerImages"];
        foreach ($innerImages as $image) {
            $this->createImage($image["name"], $image["file"], $last_id, "inner");
        }

        $images = $data["images"];
        foreach ($images as $image) {
            $this->createImage(uniqid(), $image, $last_id, "under");
        }
    }

    public function update(array $data)
    {
        $sql = "UPDATE events SET title = :title, description = :description, body = :body, 
        date = :date, category = :category, owner_id = :owner_id, active = :active";


        $sql_values = [
            'title' => $data["title"],
            'description' => $data["description"],
            'body' => $data["body"],
            'date' => $data["date"],
            'category' => $data["category"],
            'owner_id' => $data["owner_id"],
            'active' => $data["active"],
            'id' => $data["id"]
        ];

        if ($data["image"] != "no-change") {
            if (file_exists("{$this->path}/images/events/{$data["prevImage"]}")) {
                unlink("{$this->path}/images/events/{$data["prevImage"]}");
            }
            $image_name = $this->utils->createImage($data["image"], 1200, "/images/events");

            $sql = $sql . ", image = :image";
            $sql_values["image"] = $image_name;
        }

        $sql = $sql . " WHERE id = :id";
        $stmt = $this->conn->prepare($sql);
        $stmt->execute($sql_values);


        $innerImages = $data["innerImages"];
        foreach ($innerImages as $image) {
            $this->createImage($image["name"], $image["file"], $data["id"], "inner");
        }

        $deletedImages = $data["deletedImages"];
        foreach ($deletedImages as $image) {
            $this->deleteImage($image);
        }

        $images = $data["images"];
        foreach ($images as $image) {
            $this->createImage(uniqid(), $image, $data["id"], "under");
        }
    }

    public function delete(string $id)
    {
        $article = $this->get($id);

        $imageName = $article["image"];

        if (file_exists("{$this->path}/images/events/{$imageName}")) {
            unlink("{$this->path}/images/events/{$imageName}");
        }

        $sql = "DELETE FROM events WHERE id = :id";

        $stmt = $this->conn->prepare($sql);

        $stmt->bindValue(":id", $id, PDO::PARAM_INT);

        $stmt->execute();

        $sql_select = "SELECT * FROM event_images WHERE event_id = :id";
        $stmt_select = $this->conn->prepare($sql_select);

        $stmt_select->execute([
            'id' => $id
        ]);

        while ($row = $stmt_select->fetch(PDO::FETCH_ASSOC)) {
            $sql_row = "DELETE FROM event_images WHERE id = :id";

            $stmt = $this->conn->prepare($sql_row);

            $stmt->bindValue(":id", $row["id"], PDO::PARAM_INT);

            $stmt->execute();

            if (file_exists("{$this->path}/images/events/{$row['name']}")) {
                unlink("{$this->path}/images/events/{$row['name']}");
            }
        }
    }



    public function getCategory(string $id): array
    {
        $sql = "SELECT * FROM events_categories WHERE id = :id LIMIT 1";
        $stmt = $this->conn->prepare($sql);

        $stmt->execute([
            'id' => $id
        ]);

        $data = $stmt->fetch(PDO::FETCH_ASSOC);
        return $data;
    }

    public function getCategories(): array
    {
        $sql = "SELECT * FROM events_categories ORDER BY name";
        $stmt = $this->conn->query($sql);

        $data = [];
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $data[] = $row;
        }

        return $data;
    }

    public function createCategory(array $data)
    {
        $sql = "INSERT INTO events_categories (name) VALUES (:name)";
        $stmt = $this->conn->prepare($sql);

        $stmt->execute([
            'name' => $data["name"]
        ]);
    }

    public function updateCategory(array $data)
    {
        $sql = "UPDATE events_categories SET name = :name WHERE id = :id";

        $stmt = $this->conn->prepare($sql);

        $stmt->execute([
            'name' => $data["name"],
            'id' => $data["id"]
        ]);
    }

    public function deleteCategory(string $id)
    {
        $sql = "DELETE FROM events_categories WHERE id = :id";
        $stmt = $this->conn->prepare($sql);
        $stmt->bindValue(":id", $id, PDO::PARAM_INT);
        $stmt->execute();

        $sql_select = "SELECT * FROM events WHERE category = :id";
        $stmt_select = $this->conn->prepare($sql_select);

        $stmt_select->execute([
            'id' => $id
        ]);

        while ($row = $stmt_select->fetch(PDO::FETCH_ASSOC)) {
            $this->delete($row["id"]);
        }
    }

    private function createImage($image_name, $base64, $article_id, $type)
    {
        $image_name_result = $this->utils->createImage($base64, 1000, "/images/events", $image_name);

        $sql = "INSERT INTO event_images (name, type, event_id) VALUES (:name, :type, :event_id)";
        $stmt = $this->conn->prepare($sql);

        $stmt->execute([
            'name' => $image_name_result,
            'type' => $type,
            'event_id' => $article_id
        ]);
    }

    public function deleteImage($image_name)
    {
        $sql = "DELETE FROM event_images WHERE name = :name";
        $stmt = $this->conn->prepare($sql);

        $stmt->execute([
            'name' => $image_name
        ]);

        if (file_exists("{$this->path}/images/events/{$image_name}")) {
            unlink("{$this->path}/images/events/{$image_name}");
        }
    }
}
