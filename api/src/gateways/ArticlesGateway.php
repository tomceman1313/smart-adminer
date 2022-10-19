<?php

class ArticlesGateway
{
    public function __construct(Database $database)
    {
        $this->conn = $database->getConnection();
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
        file_put_contents("../public/images/articles/{$image_name}.{$imageExtension}", $decodedImageData);

        $sql = "INSERT INTO articles (title, description, image, body, date, category, owner_id) VALUES (:title, :description, :image, :body, :date, :category, :owner_id)";
        $stmt = $this->conn->prepare($sql);

        $stmt->execute([
            'title' => $data["title"],
            'description' => $data["description"],
            'image' => $image_name . ".{$imageExtension}",
            'body' => $data["body"],
            'date' => $data["date"],
            'category' => $data["category"],
            'owner_id' => $data["owner_id"],
            'active' => "1"
        ]);

        return true;
    }

    public function get(string $id): array
    {
        $sql = "SELECT * FROM articles WHERE id = :id LIMIT 1";
        $stmt = $this->conn->prepare($sql);

        $stmt->execute([
            'id' => $id
        ]);

        $data = $stmt->fetch(PDO::FETCH_ASSOC);
        return $data;
    }

    public function update(array $data): bool
    {
        $sql = "UPDATE articles SET title = :title, description = :description, image = :image,
         body = :body, date = :date, category = :category, owner_id = :owner_id WHERE id = :id";

        $stmt = $this->conn->prepare($sql);

        $stmt->execute([
            'title' => $data["title"],
            'description' => $data["description"],
            'image' => $data["image"],
            'body' => $data["body"],
            'date' => $data["date"],
            'category' => $data["category"],
            'owner_id' => $data["owner_id"],
            'id' => $data["id"]
        ]);

        return true;
    }

    public function delete(string $id): int
    {
        $sql = "DELETE FROM articles WHERE id = :id";

        $stmt = $this->conn->prepare($sql);

        $stmt->bindValue(":id", $id, PDO::PARAM_INT);

        $stmt->execute();


        return true;
    }

    function getAll(): array
    {
        $sql = "SELECT * FROM articles";
        $stmt = $this->conn->query($sql);

        $data = [];
        // boolean values have to converted manualy, represented by 0/1 by default
        // $row["bool column"] = (bool) $row["bool column];
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $data[] = $row;
        }

        return $data;
    }
}
