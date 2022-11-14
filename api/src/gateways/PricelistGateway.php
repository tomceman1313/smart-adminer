<?php

class PricelistGateway
{
    public function __construct(Database $database)
    {
        $this->conn = $database->getConnection();
    }

    function getAll(): array
    {
        $sql = "SELECT * FROM pricelist";
        $stmt = $this->conn->query($sql);

        $data = [];
        // boolean values have to converted manualy, represented by 0/1 by default
        // $row["bool column"] = (bool) $row["bool column];
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $data[] = $row;
        }

        return $data;
    }

    public function create(array $data): string
    {
        $sql = "INSERT INTO pricelist (name, price, special_price, special_price_start, special_price_end) VALUES (:name, :price, :special_price, :special_price_start, :special_price_end)";
        $stmt = $this->conn->prepare($sql);

        $stmt->execute([
            'name' => $data["name"],
            'price' => $data["price"],
            'special_price' => $data["special_price"],
            'special_price_start' => $data["start"],
            'special_price_end' => $data["end"]
        ]);

        return $this->conn->lastInsertId();
    }

    public function get(string $id): array
    {
        $sql = "SELECT * FROM pricelist WHERE id = :id LIMIT 1";
        $stmt = $this->conn->prepare($sql);

        $stmt->execute([
            'id' => $id
        ]);

        $data = $stmt->fetch(PDO::FETCH_ASSOC);
        return $data;
    }

    public function update(array $data): int
    {
        $sql = "UPDATE pricelist SET name = :name, price = :price, special_price = :special_price,
         special_price_start = :start, special_price_end = :end WHERE id = :id";

        $stmt = $this->conn->prepare($sql);

        if ($data["start"] > $data["end"]) {
            return false;
        }

        $stmt->execute([
            'name' => $data["name"],
            'price' => $data["price"],
            'special_price' => $data["special_price"],
            'start' => $data["start"],
            'end' => $data["end"],
            'id' => $data["id"]
        ]);

        return true;
    }

    public function delete(string $id): int
    {
        $sql = "DELETE FROM pricelist WHERE id = :id";

        $stmt = $this->conn->prepare($sql);

        $stmt->bindValue(":id", $id, PDO::PARAM_INT);

        $stmt->execute();


        return $stmt->rowCount();
    }
}
