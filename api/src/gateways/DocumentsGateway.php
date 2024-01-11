<?php

class DocumentsGateway
{
    public function __construct(Database $database)
    {
        $this->conn = $database->getConnection();
        include(dirname(__FILE__) . '/../publicFolderPath.php');
        $this->utils = new Utils($database);
        $this->path = $path;
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

    public function getAll(): array
    {
        $sql = "SELECT * FROM documents ORDER BY id DESC";
        $stmt = $this->conn->query($sql);

        $data = [];
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $data[] = $row;
        }

        return $data;
    }

    public function getByCategory(string $category_id): array
    {
        $sql = "SELECT * FROM documents WHERE category_id = :id ORDER BY id DESC";

        $stmt = $this->conn->prepare($sql);

        $stmt->execute([
            'id' => $category_id
        ]);

        $data = [];
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            if (file_exists("{$this->path}/files/documents/" . $row["name"])) {
                $row["size"] = filesize("{$this->path}/files/documents/" . $row["name"]);
            } else {
                $row["size"] = 8.1;
            }
            $data[] = $row;
        }

        return $data;
    }

    public function create(array $data): bool
    {
        $base64DataString = $data["file"];
        list($dataType, $fileData) = explode(';', $base64DataString);
        // file extension
        $fileExtension = explode('/', $dataType)[1];
        if ($fileExtension == "plain") {
            $fileExtension = "txt";
        }
        if ($fileExtension == "msword") {
            $fileExtension = "doc";
        }
        // base64-encoded file data
        list(, $encodedImageData) = explode(',', $fileData);
        // decode base64-encoded image data
        $decodedFileData = base64_decode($encodedImageData);
        // save data as file
        $file_name = str_replace(" ", "_", $data["file_name"]);
        file_put_contents("{$this->path}/files/documents/{$file_name}.{$fileExtension}", $decodedFileData);

        $sql = "INSERT INTO documents (title, description, image, name, category_id, date) VALUES (:title, :description, :image, :name, :category_id, :date)";
        $stmt = $this->conn->prepare($sql);

        $image_name = "";
        if (array_key_exists("image", $data)) {
            $image_name = $this->utils->createImage($data["image"], 600, "/images/documents");
        }

        $stmt->execute([
            'title' => $data["title"],
            'description' => $data["description"],
            'image' => $image_name,
            'name' => $file_name . ".{$fileExtension}",
            'category_id' => $data["category_id"],
            'date' => $data["date"]
        ]);

        return $this->conn->lastInsertId();
    }

    public function update(array $data): bool
    {
        $sql = "UPDATE documents SET title = :title, description = :description, category_id = :category_id, date = :date WHERE id = :id";
        $stmt = $this->conn->prepare($sql);

        $stmt->execute([
            'title' => $data["title"],
            'description' => $data["description"],
            'category_id' => $data["category_id"],
            'date' => $data["date"],
            'id' => $data["id"]
        ]);

        return true;
    }

    public function multipleCreate(array $data)
    {
        $files = $data["files"];
        foreach ($files as $file) {
            $base64DataString = $file["file"];
            list($dataType, $fileData) = explode(';', $base64DataString);
            $fileExtension = explode('/', $dataType)[1];

            if ($fileExtension == "plain") {
                $fileExtension = "txt";
            }

            list(, $encodedFileData) = explode(',', $fileData);
            $decodedFileData = base64_decode($encodedFileData);
            $file_name = str_replace(" ", "_", $file["filename"]);

            file_put_contents("{$this->path}/files/documents/{$file_name}.{$fileExtension}", $decodedFileData);


            $sql = "INSERT INTO documents (title, name, category_id, date) VALUES (:title, :name, :category_id, :date)";
            $stmt = $this->conn->prepare($sql);

            $stmt->execute([
                'title' => $file_name,
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
        if (file_exists("{$this->path}/files/documents/{$fileName}")) {
            unlink("{$this->path}/files/documents/{$fileName}");
        }

        $imageName = $document["image"];
        if ($imageName != "" && file_exists("{$this->path}/images/documents/{$imageName}")) {
            unlink("{$this->path}/images/documents/{$imageName}");
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

    public function getCategories(): array
    {
        $sql = "SELECT * FROM documents_categories ORDER BY name";
        $stmt = $this->conn->query($sql);

        $data = [];

        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $sql_number_of_docs = "SELECT COUNT(*) as count FROM documents WHERE category_id = :id";
            $stmt_count = $this->conn->prepare($sql_number_of_docs);
            $stmt_count->execute([
                'id' => $row["id"]
            ]);
            $count = $stmt_count->fetch(PDO::FETCH_ASSOC);

            $row["count"] = $count["count"];

            $data[] = $row;
        }

        return $data;
    }

    public function createCategory(array $data): bool
    {
        $sql = "INSERT INTO documents_categories (name) VALUES (:name)";
        $stmt = $this->conn->prepare($sql);

        $stmt->execute([
            'name' => $data["name"]
        ]);

        return true;
    }

    public function updateCategory(array $data): bool
    {
        $sql = "UPDATE documents_categories SET name = :name WHERE id = :id";

        $stmt = $this->conn->prepare($sql);

        $stmt->execute([
            'name' => $data["name"],
            'id' => $data["id"]
        ]);

        return true;
    }

    public function deleteCategory(string $id): int
    {
        $sql = "DELETE FROM documents_categories WHERE id = :id";

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
