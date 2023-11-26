<?php

class ArticlesGateway
{
    public function __construct(Database $database)
    {
        $this->conn = $database->getConnection();
        include(dirname(__FILE__) . '/../publicFolderPath.php');
        $this->path = $path;
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
        // boolean values have to converted manualy, represented by 0/1 by default
        // $row["bool column"] = (bool) $row["bool column];
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $images[] = $row;
        }
        $data["images"] = $images;
        return $data;
    }

    public function getByCategory(string $category_id): array
    {
        //$sql = "SELECT * FROM articles WHERE category = :id";
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

    function getAll(): array
    {
        $sql = "SELECT articles.*, articles_categories.private FROM articles INNER JOIN articles_categories ON articles.category = articles_categories.id ORDER BY articles.id DESC";
        $stmt = $this->conn->query($sql);

        $data = [];
        // boolean values have to converted manualy, represented by 0/1 by default
        // $row["bool column"] = (bool) $row["bool column];
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $data[] = $row;
        }

        return $data;
    }

    public function create(array $data, int $userId): bool
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
        file_put_contents("{$this->path}/images/articles/{$image_name}.{$imageExtension}", $decodedImageData);

        $this->compress($image_name . "." . $imageExtension);

        $sql = "INSERT INTO articles (title, description, image, body, date, category, owner_id, active) VALUES (:title, :description, :image, :body, :date, :category, :owner_id, :active)";
        $stmt = $this->conn->prepare($sql);

        $stmt->execute([
            'title' => $data["title"],
            'description' => $data["description"],
            'image' => $image_name . ".{$imageExtension}",
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

        return true;
    }

    public function update(array $data): bool
    {
        if ($data["image"] != "no-change") {
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
            file_put_contents("{$this->path}/images/articles/{$image_name}.{$imageExtension}", $decodedImageData);

            if (file_exists("{$this->path}/images/articles/{$data["prevImage"]}")) {
                unlink("{$this->path}/images/articles/{$data["prevImage"]}");
            }

            $this->compress($image_name . "." . $imageExtension);

            $sql = "UPDATE articles SET title = :title, description = :description, image = :image,
            body = :body, date = :date, category = :category, owner_id = :owner_id, active = :active WHERE id = :id";

            $stmt = $this->conn->prepare($sql);

            $stmt->execute([
                'title' => $data["title"],
                'description' => $data["description"],
                'image' => $image_name . ".{$imageExtension}",
                'body' => $data["body"],
                'date' => $data["date"],
                'category' => $data["category"],
                'owner_id' => $data["owner_id"],
                'active' => $data["active"],
                'id' => $data["id"]
            ]);
        } else {
            $sql = "UPDATE articles SET title = :title, description = :description, 
            body = :body, date = :date, category = :category, owner_id = :owner_id, active = :active WHERE id = :id";

            $stmt = $this->conn->prepare($sql);

            $stmt->execute([
                'title' => $data["title"],
                'description' => $data["description"],
                'body' => $data["body"],
                'date' => $data["date"],
                'category' => $data["category"],
                'owner_id' => $data["owner_id"],
                'active' => $data["active"],
                'id' => $data["id"]
            ]);
        }

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

        return true;
    }

    public function delete(string $id): int
    {
        $article = $this->get($id);

        $imageName = $article["image"];

        if (file_exists("{$this->path}/images/articles/{$imageName}")) {
            unlink("{$this->path}/images/articles/{$imageName}");
        }

        $sql = "DELETE FROM articles WHERE id = :id";

        $stmt = $this->conn->prepare($sql);

        $stmt->bindValue(":id", $id, PDO::PARAM_INT);

        $stmt->execute();

        $sql_select = "SELECT * FROM article_images WHERE article_id = :id";
        $stmt_select = $this->conn->prepare($sql_select);

        $stmt_select->execute([
            'id' => $id
        ]);

        while ($row = $stmt_select->fetch(PDO::FETCH_ASSOC)) {
            $sql_row = "DELETE FROM article_images WHERE id = :id";

            $stmt = $this->conn->prepare($sql_row);

            $stmt->bindValue(":id", $row["id"], PDO::PARAM_INT);

            $stmt->execute();

            if (file_exists("{$this->path}/images/articles/{$row['name']}")) {
                unlink("{$this->path}/images/articles/{$row['name']}");
            }
        }


        return true;
    }

    public function getCategory(string $id): array
    {

        $sql = "SELECT * FROM articles_categories WHERE id = :id LIMIT 1";
        $stmt = $this->conn->prepare($sql);

        $stmt->execute([
            'id' => $id
        ]);

        $data = $stmt->fetch(PDO::FETCH_ASSOC);
        return $data;
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

    public function deleteCategory(string $id): int
    {
        $sql = "DELETE FROM articles_categories WHERE id = :id";

        $stmt = $this->conn->prepare($sql);

        $stmt->bindValue(":id", $id, PDO::PARAM_INT);

        $stmt->execute();

        $sql_select = "SELECT * FROM articles WHERE category = :id";
        $stmt_select = $this->conn->prepare($sql_select);

        $stmt_select->execute([
            'id' => $id
        ]);

        while ($row = $stmt_select->fetch(PDO::FETCH_ASSOC)) {
            $this->delete($row["id"]);
        }

        return true;
    }

    private function compress($imageName)
    {
        $source = "{$this->path}/images/articles/{$imageName}";
        // $quality = 75;
        set_time_limit(10);
        do {
            if (file_exists($source)) {
                $info = getimagesize($source);
                $width = $info[0];
                $height = $info[1];
                @$exif = exif_read_data($source);

                if ($info['mime'] == 'image/jpeg')
                    $image = imagecreatefromjpeg($source);

                elseif ($info['mime'] == 'image/gif')
                    $image = imagecreatefromgif($source);

                elseif ($info['mime'] == 'image/png')
                    $image = imagecreatefrompng($source);


                if ($width > 1920) {
                    $aspectRatio = $width / $height;
                    $imageResized = imagescale($image, 1920, 1920 / $aspectRatio);
                } else {
                    $imageResized = $image;
                }

                if (!empty($exif['Orientation'])) {
                    switch ($exif['Orientation']) {
                        case 8:
                            $imageResized = imagerotate($imageResized, 90, 0);
                            break;
                        case 3:
                            $imageResized = imagerotate($imageResized, 180, 0);
                            break;
                        case 6:
                            $imageResized = imagerotate($imageResized, -90, 0);
                            break;
                    }
                }
                if ($info['mime'] == 'image/jpeg')
                    imagejpeg($imageResized, $source);
                elseif ($info['mime'] == 'image/gif')
                    imagegif($imageResized, $source);
                elseif ($info['mime'] == 'image/png') {
                    imagesavealpha($imageResized, true);
                    imagepng($imageResized, $source);
                } else
                    imagejpeg($imageResized, $source);
                break;
            }
        } while (true);
    }

    private function createImage($image_name, $base64, $article_id, $type)
    {
        $base64DataString = $base64;
        list($dataType, $imageData) = explode(';', $base64DataString);
        // image file extension
        $imageExtension = explode('/', $dataType)[1];
        // base64-encoded image data
        list(, $encodedImageData) = explode(',', $imageData);
        // decode base64-encoded image data
        $decodedImageData = base64_decode($encodedImageData);

        file_put_contents("{$this->path}/images/articles/{$image_name}.{$imageExtension}", $decodedImageData);

        $this->compress($image_name . "." . $imageExtension);

        $sql = "INSERT INTO article_images (name, type, article_id) VALUES (:name, :type, :article_id)";
        $stmt = $this->conn->prepare($sql);

        $stmt->execute([
            'name' => "{$image_name}.{$imageExtension}",
            'type' => $type,
            'article_id' => $article_id
        ]);
    }

    public function deleteImage($image_name)
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
