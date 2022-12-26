<?php

class GalleryGateway
{
    public function __construct(Database $database)
    {
        $this->conn = $database->getConnection();
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
        file_put_contents("../public/images/gallery/{$image_name}.{$imageExtension}", $decodedImageData);

        $sql = "INSERT INTO gallery (name, category_id) VALUES (:name, :category_id)";
        $stmt = $this->conn->prepare($sql);

        $stmt->execute([
            'name' => $image_name . ".{$imageExtension}",
            'category_id' => $data["category_id"]
        ]);

        return true;
    }

    public function delete(string $id): int
    {
        $article = $this->get($id);
        $imageName = $article["image"];

        if (file_exists("../public/images/gallery/{$imageName}")) {
            unlink("../public/images/gallery/{$imageName}");
        }

        $sql = "DELETE FROM gallery WHERE id = :id";

        $stmt = $this->conn->prepare($sql);

        $stmt->bindValue(":id", $id, PDO::PARAM_INT);

        $stmt->execute();


        return true;
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

    function getCategories(): array
    {
        $sql = "SELECT * FROM gallery_category";
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


        return true;
    }
}
