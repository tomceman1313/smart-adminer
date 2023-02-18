<?php

class DocumentsGateway
{
    public function __construct(Database $database)
    {
        $this->conn = $database->getConnection();
    }

    public function get(string $id): array
    {
        $sql = "SELECT * FROM documents WHERE id = :id LIMIT 1";
        $stmt = $this->conn->prepare($sql);

        $stmt->execute([
            'id' => $id
        ]);

        $data = $stmt->fetch(PDO::FETCH_ASSOC);
        return $data;
    }

    public function create(array $data): bool
    {
        $base64DataString = $data["file"];
        list($dataType, $fileData) = explode(';', $base64DataString);

        // image file extension
        $fileExtension = explode('/', $dataType)[1];
        if ($fileExtension == "plain") {
            $fileExtension = "txt";
        }
        // base64-encoded image data
        list(, $encodedImageData) = explode(',', $fileData);


        // decode base64-encoded image data
        $decodedFileData = base64_decode($encodedImageData);

        // save image data as file
        $file_name = str_replace(" ", "_", $data["file_name"]);
        file_put_contents("../public/files/documents/{$file_name}.{$fileExtension}", $decodedFileData);

        $sql = "INSERT INTO documents (name, category_id, date) VALUES (:name, :category_id, :date)";
        $stmt = $this->conn->prepare($sql);

        $stmt->execute([
            'name' => $file_name . ".{$fileExtension}",
            'category_id' => $data["category_id"],
            'date' => $data["date"]
        ]);

        return $this->conn->lastInsertId();;
    }

    public function multipleCreate(array $data)
    {
        $files = $data["files"];
        foreach ($files as $file) {
            $base64DataString = $file["file"];
            list($dataType, $fileData) = explode(';', $base64DataString);
            // image file extension
            $fileExtension = explode('/', $dataType)[1];

            if ($fileExtension == "plain") {
                $fileExtension = "txt";
            }

            // base64-encoded image data
            list(, $encodedfileData) = explode(',', $fileData);
            // decode base64-encoded image data
            $decodedfileData = base64_decode($encodedfileData);
            // save image data as file
            $file_name = str_replace(" ", "_", $data["file_name"]);

            file_put_contents("../public/files/documents/{$file_name}.{$fileExtension}", $decodedfileData);


            $sql = "INSERT INTO documents (name, category_id, date) VALUES (:name, :category_id, :date)";
            $stmt = $this->conn->prepare($sql);

            $stmt->execute([
                'name' => $file_name . ".{$fileExtension}",
                'category_id' => $data["category_id"],
                'date' => $data["date"]
            ]);
        }
        return true;
    }

    public function delete(string $id): int
    {
        $document = $this->get($id);
        $fileName = $document["name"];

        if (file_exists("../public/files/documents/{$fileName}")) {
            unlink("../public/files/documents/{$fileName}");
        }

        $sql = "DELETE FROM documents WHERE id = :id";

        $stmt = $this->conn->prepare($sql);

        $stmt->bindValue(":id", $id, PDO::PARAM_INT);

        $stmt->execute();
        return true;
    }

    public function multipleDelete(array $ids)
    {
        foreach ($ids as $document) {
            $this->delete($document);
        }
    }


    function getAll(): array
    {
        $sql = "SELECT * FROM documents";
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
        $sql = "SELECT * FROM documents WHERE category_id=:id";

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

    function getCategories(): array
    {
        $sql = "SELECT * FROM documents_category ORDER BY name";
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
        $sql = "INSERT INTO documents_category (name) VALUES (:name)";
        $stmt = $this->conn->prepare($sql);

        $stmt->execute([
            'name' => $data["name"]
        ]);

        return true;
    }

    public function updateCategory(array $data): bool
    {
        $sql = "UPDATE documents_category SET name = :name WHERE id = :id";

        $stmt = $this->conn->prepare($sql);

        $stmt->execute([
            'name' => $data["name"],
            'id' => $data["id"]
        ]);

        return true;
    }

    public function deleteCategory(string $id): int
    {
        $sql = "DELETE FROM documents_category WHERE id = :id";

        $stmt = $this->conn->prepare($sql);

        $stmt->bindValue(":id", $id, PDO::PARAM_INT);

        $stmt->execute();

        $sql_select = "SELECT * FROM documents WHERE category_id = :id";
        $stmt_select = $this->conn->prepare($sql_select);

        $stmt_select->execute([
            'id' => $id
        ]);

        while ($row = $stmt_select->fetch(PDO::FETCH_ASSOC)) {
            $this->delete($row["id"]);
        }


        return true;
    }
}
