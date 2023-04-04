<?php
class GalleryGateway
{
    public function __construct(Database $database)
    {
        $this->conn = $database->getConnection();
        include(dirname(__FILE__) . '/../publicFolderPath.php');
        $this->path = $path;
    }

    public function get(string $id): array
    {
        $sql = "SELECT * FROM gallery WHERE id = :id LIMIT 1";
        $stmt = $this->conn->prepare($sql);

        $stmt->execute([
            'id' => $id
        ]);

        $data = $stmt->fetch(PDO::FETCH_ASSOC);
        return $data;
    }

    public function create(array $data): bool
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
        if (file_put_contents("{$this->path}/images/gallery/{$image_name}.{$imageExtension}", $decodedImageData)) {
            $this->compress($image_name . "." . $imageExtension);
        } else {
            return false;
        }

        $sql = "INSERT INTO gallery (name, title, description, date) VALUES (:name, :title, :description, :date)";
        $stmt = $this->conn->prepare($sql);

        $stmt->execute([
            'name' => $image_name . ".{$imageExtension}",
            'title' => $data["title"],
            'description' => $data["description"],
            'date' => $data["date"]
        ]);

        $categories = $data["category_id"];
        $last_id = $this->conn->lastInsertId();

        $sql_image = "INSERT INTO image_category (image_id, category_id) VALUES (:image_id, :category_id)";
        foreach ($categories as $item) {
            $stmt = $this->conn->prepare($sql_image);
            $stmt->execute([
                'image_id' => $last_id,
                'category_id' => $item["id"]
            ]);
        }

        return true;
    }

    public function multipleCreate(array $data)
    {
        $images = $data["images"];
        foreach ($images as $image) {
            $base64DataString = $image;
            list($dataType, $imageData) = explode(';', $base64DataString);
            // image file extension
            $imageExtension = explode('/', $dataType)[1];
            // base64-encoded image data
            list(, $encodedImageData) = explode(',', $imageData);
            // decode base64-encoded image data
            $decodedImageData = base64_decode($encodedImageData);
            // save image data as file
            $image_name = uniqid();

            file_put_contents("{$this->path}/images/gallery/{$image_name}.{$imageExtension}", $decodedImageData);

            $this->compress($image_name . "." . $imageExtension);

            $sql = "INSERT INTO gallery (name, date) VALUES (:name, :date)";
            $stmt = $this->conn->prepare($sql);

            $stmt->execute([
                'name' => $image_name . ".{$imageExtension}",
                'date' => $data["date"]
            ]);

            $categories = $data["category_id"];
            $last_id = $this->conn->lastInsertId();

            $sql_image = "INSERT INTO image_category (image_id, category_id) VALUES (:image_id, :category_id)";
            foreach ($categories as $item) {
                $stmt = $this->conn->prepare($sql_image);
                $stmt->execute([
                    'image_id' => $last_id,
                    'category_id' => $item["id"]
                ]);
            }
        }
        return true;
    }

    private function compress($imageName)
    {
        $source = "{$this->path}/images/gallery/{$imageName}";
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

                if ($width > 1920) {
                    $aspectRatio = $width / $height;
                    $imageResized = imagescale($image, 1920, 1920 / $aspectRatio);
                } else {
                    $imageResized = $image;
                }

                imagejpeg($imageResized, $source);
                break;
            }
        } while (true);
    }

    public function update(array $data): bool
    {
        $sql = "UPDATE gallery SET title = :title, description = :description WHERE id = :id";

        $stmt = $this->conn->prepare($sql);

        $stmt->execute([
            'title' => $data["title"],
            'description' => $data["description"],
            'id' => $data["id"]
        ]);

        $sql_select = "SELECT * FROM image_category WHERE image_id = :id";
        $stmt_select = $this->conn->prepare($sql_select);

        $stmt_select->execute([
            'id' => $data["id"]
        ]);

        while ($row = $stmt_select->fetch(PDO::FETCH_ASSOC)) {
            $sql = "DELETE FROM image_category WHERE id = :id";

            $stmt = $this->conn->prepare($sql);

            $stmt->bindValue(":id", $row["id"], PDO::PARAM_INT);

            $stmt->execute();
        }


        $categories = $data["category_id"];

        $sql_image = "INSERT INTO image_category (image_id, category_id) VALUES (:image_id, :category_id)";
        foreach ($categories as $item) {
            $stmt = $this->conn->prepare($sql_image);
            $stmt->execute([
                'image_id' => $data["id"],
                'category_id' => $item["id"]
            ]);
        }

        return true;
    }

    public function delete(string $id): int
    {
        $image = $this->get($id);
        $imageName = $image["name"];

        if (file_exists("{$this->path}/images/gallery/{$imageName}")) {
            unlink("{$this->path}/images/gallery/{$imageName}");
        }

        $sql = "DELETE FROM gallery WHERE id = :id";

        $stmt = $this->conn->prepare($sql);

        $stmt->bindValue(":id", $id, PDO::PARAM_INT);

        $stmt->execute();

        $sql_select = "SELECT * FROM image_category WHERE image_id = :id";
        $stmt_select = $this->conn->prepare($sql_select);

        $stmt_select->execute([
            'id' => $id
        ]);

        while ($row = $stmt_select->fetch(PDO::FETCH_ASSOC)) {
            $sql = "DELETE FROM image_category WHERE id = :id";

            $stmt = $this->conn->prepare($sql);

            $stmt->bindValue(":id", $row["id"], PDO::PARAM_INT);

            $stmt->execute();
        }


        return true;
    }

    public function multipleDelete(array $ids)
    {
        foreach ($ids as $image) {
            $this->delete($image);
        }
    }


    function getAll(): array
    {
        $sql = "SELECT * FROM gallery";
        $stmt = $this->conn->query($sql);

        $data = [];
        // boolean values have to converted manualy, represented by 0/1 by default
        // $row["bool column"] = (bool) $row["bool column];
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $data[] = $row;
        }

        return $data;
    }

    function getByCategory(string $category_id): array
    {
        $sql = "SELECT * FROM image_category WHERE category_id=:id";

        $stmt = $this->conn->prepare($sql);

        $stmt->execute([
            'id' => $category_id
        ]);

        $ids = [];
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $ids[] = $row["image_id"];
        }

        if (sizeof($ids) == 0) {
            return [];
        }

        $sql = "SELECT * FROM gallery WHERE id IN (" . implode(',', $ids) . ")";
        $stmt = $this->conn->query($sql);

        $data = [];
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $data[] = $row;
        }

        return $data;
    }

    function getImageCategories(string $image_id): array
    {
        $sql = "SELECT * FROM image_category WHERE image_id=:id";

        $stmt = $this->conn->prepare($sql);

        $stmt->execute([
            'id' => $image_id
        ]);

        $ids = [];
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $ids[] = $row["category_id"];
        }

        if (sizeof($ids) == 0) {
            return [];
        }

        $sql = "SELECT * FROM gallery_category WHERE id IN (" . implode(',', $ids) . ")";
        $stmt = $this->conn->query($sql);

        $data = [];
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $data[] = $row;
        }

        return $data;
    }

    function getCategories(): array
    {
        $sql = "SELECT * FROM gallery_category ORDER BY name";
        $stmt = $this->conn->query($sql);

        $data = [];
        // boolean values have to converted manualy, represented by 0/1 by default
        // $row["bool column"] = (bool) $row["bool column];
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $data[] = $row;
        }

        return $data;
    }

    public function createCategory(array $data): bool
    {
        $sql = "INSERT INTO gallery_category (name) VALUES (:name)";
        $stmt = $this->conn->prepare($sql);

        $stmt->execute([
            'name' => $data["name"]
        ]);

        return true;
    }

    public function updateCategory(array $data): bool
    {
        $sql = "UPDATE gallery_category SET name = :name WHERE id = :id";

        $stmt = $this->conn->prepare($sql);

        $stmt->execute([
            'name' => $data["name"],
            'id' => $data["id"]
        ]);

        return true;
    }

    public function deleteCategory(string $id): int
    {
        $sql = "DELETE FROM gallery_category WHERE id = :id";

        $stmt = $this->conn->prepare($sql);

        $stmt->bindValue(":id", $id, PDO::PARAM_INT);

        $stmt->execute();

        $sql_select = "SELECT * FROM image_category WHERE category_id = :id";
        $stmt_select = $this->conn->prepare($sql_select);

        $stmt_select->execute([
            'id' => $id
        ]);

        while ($row = $stmt_select->fetch(PDO::FETCH_ASSOC)) {
            $sql = "DELETE FROM image_category WHERE id = :id";

            $stmt = $this->conn->prepare($sql);

            $stmt->bindValue(":id", $row["id"], PDO::PARAM_INT);

            $stmt->execute();
        }


        return true;
    }

    public function test()
    {
        return $this->path;
    }
}
