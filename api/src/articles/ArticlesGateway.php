<?php

class ArticlesGateway
{
    public function __construct(Database $database)
    {
        $this->conn = $database->getConnection();
        include(dirname(__FILE__) . '/../publicFolderPath.php');
        $this->path = $path;
        $this->utils = new Utils($database);
    }

    public function get(string $id): array
    {
        $sql = "SELECT * FROM articles WHERE id = :id LIMIT 1";
        $stmt = $this->conn->prepare($sql);

        $stmt->execute([
            'id' => $id
        ]);

        $data = $stmt->fetch(PDO::FETCH_ASSOC);

        $sql = "SELECT id, name FROM article_images WHERE article_id = :id AND type = 'under'";
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
        $sql = "SELECT articles.*, articles_categories.private FROM articles INNER JOIN articles_categories ON articles.category = articles_categories.id WHERE articles.category = :id ORDER BY articles.id DESC";
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

    function getByCategoryName(string $category_name): array
    {
        $sql = "SELECT articles.* FROM articles INNER JOIN articles_categories ON articles.category = articles_categories.id WHERE articles_categories.name = :category_name";
        $stmt = $this->conn->prepare($sql);

        $stmt->execute([
            'category_name' => $category_name
        ]);

        $data = [];
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $data[] = $row;
        }

        return $data;
    }

    function getNews(): array
    {
        $sql = "SELECT id, title, description, date, active, image FROM articles ";
        $stmt = $this->conn->query($sql);
        $data = [];
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $row["type"] = "article";
            $data[] = $row;
        }

        $sql = "SELECT id, title, description, date, active, image FROM events ORDER BY date DESC";
        $stmt = $this->conn->query($sql);
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $row["type"] = "event";
            $data[] = $row;
        }

        usort($data, function ($a, $b) {
            return $a['date'] < $b['date'];
        });

        return array_slice($data, 0, 10);
    }

    function getAll(): array
    {
        $sql = "SELECT articles.*, articles_categories.private FROM articles INNER JOIN articles_categories ON articles.category = articles_categories.id ORDER BY articles.date DESC";
        $stmt = $this->conn->query($sql);

        $data = [];
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $data[] = $row;
        }

        return $data;
    }

    public function create(array $data, int $userId)
    {
        $image_name = $this->utils->createImage($data["image"], 1200, "/images/articles");

        $sql = "INSERT INTO articles (title, description, image, body, date, category, owner_id, active) VALUES (:title, :description, :image, :body, :date, :category, :owner_id, :active)";
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
        $sql = "UPDATE articles SET title = :title, description = :description, body = :body, date = :date, category = :category, owner_id = :owner_id, active = :active";
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
            $image_name = $this->utils->createImage($data["image"], 1200, "/images/articles");

            if (file_exists("{$this->path}/images/articles/{$data["prevImage"]}")) {
                unlink("{$this->path}/images/articles/{$data["prevImage"]}");
            }

            $sql_values["image"] = $image_name;
            $sql .= ", image = :image";
        }

        $sql .= " WHERE id = :id";
        $stmt = $this->conn->prepare($sql);
        $stmt->execute($sql_values);

        $innerImages = $data["innerImages"];
        foreach ($innerImages as $image) {
            $this->createImage($image["name"], $image["file"], $data["id"], "inner");
        }

        $deletedImages = $data["deletedImages"];
        foreach ($deletedImages as $image) {
            $this->deleteInnerImage($image);
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

        if (file_exists("{$this->path}/images/articles/{$imageName}")) {
            unlink("{$this->path}/images/articles/{$imageName}");
        }

        $sql = "DELETE FROM articles WHERE id = :id";
        $stmt = $this->conn->prepare($sql);

        $stmt->execute([
            "id" => $id
        ]);

        $sql_select = "SELECT * FROM article_images WHERE article_id = :id";
        $stmt_select = $this->conn->prepare($sql_select);

        $stmt_select->execute([
            'id' => $id
        ]);

        while ($row = $stmt_select->fetch(PDO::FETCH_ASSOC)) {
            $sql_row = "DELETE FROM article_images WHERE id = :id";

            $stmt = $this->conn->prepare($sql_row);
            $stmt->execute([
                "id" => $row["id"]
            ]);

            if (file_exists("{$this->path}/images/articles/{$row['name']}")) {
                unlink("{$this->path}/images/articles/{$row['name']}");
            }
        }
    }

    public function getCategories(): array
    {
        $sql = "SELECT * FROM articles_categories ORDER BY name";
        $stmt = $this->conn->query($sql);

        $data = [];
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $data[] = $row;
        }

        return $data;
    }

    public function createCategory(array $data): bool
    {
        $sql = "INSERT INTO articles_categories (name) VALUES (:name)";
        $stmt = $this->conn->prepare($sql);

        $stmt->execute([
            'name' => $data["name"]
        ]);

        return true;
    }

    public function updateCategory(array $data): bool
    {
        $sql = "UPDATE articles_categories SET name = :name WHERE id = :id";

        $stmt = $this->conn->prepare($sql);

        $stmt->execute([
            'name' => $data["name"],
            'id' => $data["id"]
        ]);

        return true;
    }

    public function deleteCategory(string $id)
    {
        $sql = "DELETE FROM articles_categories WHERE id = :id";
        $stmt = $this->conn->prepare($sql);

        $stmt->execute([
            "id" => $id
        ]);

        $sql_select = "SELECT * FROM articles WHERE category = :id";
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
        $image_name = $this->utils->createImage($base64, 1200, "/images/articles", $image_name);

        $sql = "INSERT INTO article_images (name, type, article_id) VALUES (:name, :type, :article_id)";
        $stmt = $this->conn->prepare($sql);

        $stmt->execute([
            'name' => $image_name,
            'type' => $type,
            'article_id' => $article_id
        ]);
    }

    public function deleteImage($image_id)
    {
        $sql = "SELECT name FROM article_images WHERE id = :id LIMIT 1";
        $stmt = $this->conn->prepare($sql);
        $stmt->execute([
            'id' => $image_id
        ]);

        $image = $stmt->fetch(PDO::FETCH_ASSOC);


        $sql = "DELETE FROM article_images WHERE name = :name";
        $stmt = $this->conn->prepare($sql);

        $stmt->execute([
            'name' => $image["name"]
        ]);

        if (file_exists("{$this->path}/images/articles/{$image["name"]}")) {
            unlink("{$this->path}/images/articles/{$image["name"]}");
        }
    }

    private function deleteInnerImage($image_name)
    {
        $sql = "DELETE FROM article_images WHERE name = :name";
        $stmt = $this->conn->prepare($sql);

        $stmt->execute([
            'name' => $image_name
        ]);

        if (file_exists("{$this->path}/images/articles/{$image_name}")) {
            unlink("{$this->path}/images/articles/{$image_name}");
        }
    }
}
