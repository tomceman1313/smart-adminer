<?php

class NotificationsGateway
{
    public function __construct(Database $database)
    {
        $this->conn = $database->getConnection();
    }

    public function create(array $data): bool
    {
        if ($data["start"] > $data["end"]) {
            return false;
        }

        $sql = "INSERT INTO notifications (title, text, path, start, end) VALUES (:title, :text, :path, :start, :end)";
        $stmt = $this->conn->prepare($sql);

        $stmt->execute([
            'title' => $data["title"],
            'text' => $data["text"],
            'path' => $data["path"],
            'start' => $data["start"],
            'end' => $data["end"]
        ]);

        return true;
    }

    public function get(string $id): array
    {
        $sql = "SELECT * FROM notifications WHERE id = :id LIMIT 1";
        $stmt = $this->conn->prepare($sql);

        $stmt->execute([
            'id' => $id
        ]);

        $data = $stmt->fetch(PDO::FETCH_ASSOC);
        return $data;
    }

    public function update(array $data): bool
    {
        $sql = "UPDATE notifications SET title = :title, text = :text, path = :path,
         start = :start, end = :end WHERE id = :id";

        $stmt = $this->conn->prepare($sql);

        if ($data["start"] > $data["end"]) {
            return false;
        }

        $stmt->execute([
            'title' => $data["title"],
            'text' => $data["text"],
            'path' => $data["path"],
            'start' => $data["start"],
            'end' => $data["end"],
            'id' => $data["id"]
        ]);

        return true;
    }

    public function delete(string $id): int
    {
        $sql = "DELETE FROM notifications WHERE id = :id";

        $stmt = $this->conn->prepare($sql);

        $stmt->bindValue(":id", $id, PDO::PARAM_INT);

        $stmt->execute();


        return true;
    }

    function getAll(): array
    {
        $sql = "SELECT * FROM notifications";
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
