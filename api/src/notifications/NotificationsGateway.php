<?php

class NotificationsGateway
{
    public function __construct(Database $database)
    {
        $this->conn = $database->getConnection();
    }

    function getAll(): array
    {
        $sql = "SELECT * FROM notifications";
        $stmt = $this->conn->query($sql);

        $data = [];
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $data[] = $row;
        }

        return $data;
    }

    public function create(array $data)
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
    }

    public function update(array $data, $id)
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
            'id' => $id
        ]);
    }

    public function delete(string $id)
    {
        $sql = "DELETE FROM notifications WHERE id = :id";
        $stmt = $this->conn->prepare($sql);
        $stmt->bindValue(":id", $id, PDO::PARAM_INT);
        $stmt->execute();
    }
}
