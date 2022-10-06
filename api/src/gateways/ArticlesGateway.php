<?php

class ArticlesGateway
{
    public function __construct(Database $database)
    {
        $this->conn = $database->getConnection();
    }

    public function create(array $data): bool
    {

        // $pic = $_FILES['image']['name'];
        // $pic_tem_loc = $_FILES['image']['tmp_name'];
        // $pic_store = "/public/images/" . $pic;

        // move_uploaded_file($pic_tem_loc, $pic_store);

        $sql = "INSERT INTO articles (title, description, image, body, date, category, owner_id) VALUES (:title, :description, :image, :body, :date, :category, :owner_id)";
        $stmt = $this->conn->prepare($sql);

        $stmt->execute([
            'title' => $data["title"],
            'description' => $data["description"],
            'image' => $data["image"],
            'body' => $data["body"],
            'date' => $data["date"],
            'category' => $data["category"],
            'owner_id' => $data["owner_id"]
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
