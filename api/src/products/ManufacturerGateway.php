<?php

class ManufacturerGateway
{
    public function __construct(Database $database)
    {
        $this->conn = $database->getConnection();
        include(dirname(__FILE__) . '/../publicFolderPath.php');
        $this->path = $path;
    }

    public function get(string $id): array
    {
        $sql = "SELECT * FROM product_manufacturers WHERE id = :id LIMIT 1";
        $stmt = $this->conn->prepare($sql);

        $stmt->execute([
            'id' => $id
        ]);

        $data = $stmt->fetch(PDO::FETCH_ASSOC);
        return $data;
    }

    function getAll(): array
    {
        $sql = "SELECT * FROM product_manufacturers";
        $stmt = $this->conn->query($sql);

        $data = [];
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $data[] = $row;
        }

        return $data;
    }

    public function create(array $data)
    {
        $sql = "INSERT INTO product_manufacturers (name) VALUES (:name)";
        $stmt = $this->conn->prepare($sql);
        $stmt->execute([
            'name' => $data["name"]
        ]);
    }

    public function update(array $data, $id)
    {
        $sql = "UPDATE product_manufacturers SET name = :name WHERE id = :id";
        $stmt = $this->conn->prepare($sql);
        $stmt->execute([
            'name' => $data["name"],
            'id' => $id
        ]);
    }

    public function delete(string $id)
    {
        $sql = "DELETE FROM product_manufacturers WHERE id = :id";
        $stmt = $this->conn->prepare($sql);
        $stmt->execute([
            'id' => $id
        ]);

        $sql_select = "SELECT * FROM products WHERE manufacturer_id = :id";
        $stmt_select = $this->conn->prepare($sql_select);

        $stmt_select->execute([
            'id' => $id
        ]);

        while ($row = $stmt_select->fetch(PDO::FETCH_ASSOC)) {
            $this->delete($row["id"]);
        }
    }
}
