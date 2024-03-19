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
        $sql = "SELECT doc.*, doc_order.position FROM documents as doc LEFT OUTER JOIN document_order as doc_order ON doc.id = doc_order.document_id WHERE doc.category_id = :category_id ORDER BY -doc_order.position DESC, doc.id DESC";
        $stmt = $this->conn->prepare($sql);

        $stmt->execute([
            'category_id' => $category_id
        ]);

        $data = [];
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            if (file_exists("{$this->path}/files/documents/" . $row["name"])) {
                $row["size"] = filesize("{$this->path}/files/documents/" . $row["name"]);
            } else {
                $row["size"] = 0;
            }
            $data[] = $row;
        }

        return $data;
    }

    public function getByName(string $title, int $category_id = NULL): array
    {
        $sql_values = [
            'title' => "%" . $title . "%"
        ];

        if ($category_id) {
            $sql = "SELECT * FROM documents WHERE category_id = :category_id AND title LIKE :title";
            $sql_values["category_id"] = $category_id;
        } else {
            $sql = "SELECT * FROM documents WHERE title LIKE :title";
        }
        $stmt = $this->conn->prepare($sql);

        $stmt->execute($sql_values);

        $data = [];
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            if (file_exists("{$this->path}/files/documents/" . $row["name"])) {
                $row["size"] = filesize("{$this->path}/files/documents/" . $row["name"]);
            } else {
                $row["size"] = 0;
            }
            $data[] = $row;
        }

        return $data;
    }

    public function create(array $data): bool
    {
        $fileNameWithExtension = $this->createFile($data);

        $sql = "INSERT INTO documents (title, description, image, name, category_id, date) VALUES (:title, :description, :image, :name, :category_id, :date)";
        $stmt = $this->conn->prepare($sql);

        if (array_key_exists("image", $data)) {
            $image_name = $this->utils->createImage($data["image"], 600, "/images/documents");
        }

        $stmt->execute([
            'title' => $data["title"],
            'description' => $data["description"],
            'image' => isset($image_name) ? $image_name : "",
            'name' => $fileNameWithExtension,
            'category_id' => $data["category_id"],
            'date' => $data["date"]
        ]);

        return $this->conn->lastInsertId();
    }

    public function update(array $data)
    {
        $document = $this->get($data["id"]);

        $sql = "UPDATE documents SET title = :title, description = :description, category_id = :category_id, date = :date";
        $sql_values = [
            'title' => $data["title"],
            'description' => $data["description"],
            'category_id' => $data["category_id"],
            'date' => $data["date"],
            'id' => $data["id"]
        ];

        if (isset($data["file"])) {
            $fileName = $document["name"];
            if (file_exists("{$this->path}/files/documents/{$fileName}")) {
                unlink("{$this->path}/files/documents/{$fileName}");
            }

            $file_name_with_extension = $this->createFile($data);
            $sql .= ", name = :name";
            $sql_values["name"] = $file_name_with_extension;
        }

        if (isset($data["image"])) {
            if ($document["image"] != "" && file_exists("{$this->path}/images/documents/{$document["image"]}")) {
                unlink("{$this->path}/images/documents/{$document["image"]}");
            }

            if ($data["image"] != "") {
                $image_name = $this->utils->createImage($data["image"], 600, "/images/documents");
                $sql_values["image"] = $image_name;
            } else {
                $sql_values["image"] = "";
            }
            $sql .= ", image = :image";
        }

        $sql .= " WHERE id = :id";
        $stmt = $this->conn->prepare($sql);

        $stmt->execute($sql_values);
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
    }

    public function delete(string $id)
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
    }

    public function multipleDelete(array $ids)
    {
        foreach ($ids as $document) {
            $this->delete($document);
        }
    }

    public function updateOrder(array $data)
    {
        $sql_select = "SELECT position FROM document_order WHERE category_id = :category_id AND document_id = :document_id LIMIT 1";
        $sql_update = "UPDATE document_order SET position = :position WHERE category_id = :category_id AND document_id = :document_id";
        $sql_insert = "INSERT INTO document_order (category_id, document_id, position) VALUES (:category_id, :document_id, :position)";

        $position = 1;
        foreach ($data["documents_ids"] as $id) {
            $stmt = $this->conn->prepare($sql_update);

            $stmt->execute([
                'position' => $position,
                'category_id' => $data["category_id"],
                'document_id' => $id
            ]);

            $rows_updated = $stmt->rowCount();

            if ($rows_updated == '0') {
                $stmt = $this->conn->prepare($sql_select);
                $stmt->execute([
                    'category_id' => $data["category_id"],
                    'document_id' => $id,
                ]);

                $result = $stmt->fetch(PDO::FETCH_ASSOC);
                //check if record was found
                if (!$result) {
                    $stmt = $this->conn->prepare($sql_insert);

                    $stmt->execute([
                        'category_id' => $data["category_id"],
                        'document_id' => $id,
                        'position' => $position
                    ]);
                }
            }

            ++$position;
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

    public function createCategory(array $data)
    {
        $sql = "INSERT INTO documents_categories (name) VALUES (:name)";
        $stmt = $this->conn->prepare($sql);

        $stmt->execute([
            'name' => $data["name"]
        ]);
    }

    public function updateCategory(array $data)
    {
        $sql = "UPDATE documents_categories SET name = :name WHERE id = :id";
        $stmt = $this->conn->prepare($sql);

        $stmt->execute([
            'name' => $data["name"],
            'id' => $data["id"]
        ]);
    }

    public function deleteCategory(string $id)
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
    }

    private function createFile(array $file)
    {
        $base64DataString = $file["file"];
        list($dataType, $fileData) = explode(';', $base64DataString);
        // file extension
        $fileExtension = $file["file_extension"];

        // base64-encoded file file
        list(, $encodedImageData) = explode(',', $fileData);
        $decodedFileData = base64_decode($encodedImageData);

        $file_name = str_replace(" ", "_", $file["file_name"]);
        file_put_contents("{$this->path}/files/documents/{$file_name}.{$fileExtension}", $decodedFileData);

        return $file_name . ".{$fileExtension}";
    }
}
