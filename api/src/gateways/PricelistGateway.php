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
        $sql = "INSERT INTO users (username, password, privilege, tel, email, fname, lname) VALUES (:username, :password, :privilege, :tel, :email, :fname, :lname)";
        $stmt = $this->conn->prepare($sql);

        $hashedPassword = password_hash($data["password"], PASSWORD_DEFAULT);

        $stmt->bindValue(":username", $data["username"], PDO::PARAM_STR);
        $stmt->bindValue(":password", $hashedPassword, PDO::PARAM_STR);
        $stmt->bindValue(":privilege", $data["privilege"], PDO::PARAM_STR);
        $stmt->bindValue(":tel", $data["tel"], PDO::PARAM_STR);
        $stmt->bindValue(":email", $data["email"], PDO::PARAM_STR);
        $stmt->bindValue(":fname", $data["fname"], PDO::PARAM_STR);
        $stmt->bindValue(":lname", $data["lname"], PDO::PARAM_STR);

        $stmt->execute();

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

    public function update(array $current, array $data): int
    {
        $sql = "UPDATE pricelist SET name = :name, price = :price, special_price = :special_price,
         special_price_start = :start, special_price_end = :end WHERE id = :id";

        $stmt = $this->conn->prepare($sql);

        $stmt->execute([
            'name' => $data["name"],
            'price' => $data["price"],
            'special_price' => $data["special_price"],
            'start' => $data["start"],
            'end' => $data["end"],
            'id' => $data["id"]
        ]);

        return $stmt->rowCount();
    }

    public function delete(string $id): int
    {
        $sql = "DELETE FROM users WHERE id = :id";

        $stmt = $this->conn->prepare($sql);

        $stmt->bindValue(":id", $id, PDO::PARAM_INT);

        $stmt->execute();


        return $stmt->rowCount();
    }
}
