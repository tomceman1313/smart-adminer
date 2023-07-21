<?php

class DocumentsGateway
{
    public function __construct(Database $database)
    {
        $this->conn = $database->getConnection();
        include(dirname(__FILE__) . '/../publicFolderPath.php');
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

    public function create(array $data): bool
    {
        $base64DataString = $data["file"];
        list($dataType, $fileData) = explode(';', $base64DataString);
        // file extension
        $fileExtension = explode('/', $dataType)[1];
        if ($fileExtension == "plain") {
            $fileExtension = "txt";
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

        if (array_key_exists("image", $data)) {
            //create image
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
            file_put_contents("{$this->path}/images/documents/{$image_name}.{$imageExtension}", $decodedImageData);

            $this->compress($image_name . "." . $imageExtension);

            $stmt->execute([
                'title' => $data["title"],
                'description' => $data["description"],
                'image' => $image_name . "." . $imageExtension,
                'name' => $file_name . ".{$fileExtension}",
                'category_id' => $data["category_id"],
                'date' => $data["date"]
            ]);
            return $this->conn->lastInsertId();
        }

        $stmt->execute([
            'title' => $data["title"],
            'description' => $data["description"],
            'image' => "",
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
            $file_name = str_replace(" ", "_", $file["filename"]);

            file_put_contents("{$this->path}/files/documents/{$file_name}.{$fileExtension}", $decodedfileData);


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


    function getAll(): array
    {
        $sql = "SELECT * FROM documents";
        $stmt = $this->conn->query($sql);

        $data = [];
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $data[] = $row;
        }

        return $data;
    }

    function getByCategory(string $category_id): array
    {
        $sql = "SELECT * FROM documents WHERE category_id = :id";

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

    function getCategories(): array
    {
        $sql = "SELECT * FROM documents_categories ORDER BY name";
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

    private function compress($imageName)
    {
        $source = "{$this->path}/images/documents/{$imageName}";
        // $quality = 75;
        set_time_limit(10);
        do {
            if (file_exists($source)) {
                $info = getimagesize($source);
                $width = $info[0];
                $height = $info[1];
                $exif = exif_read_data($source);

                if ($info['mime'] == 'image/jpeg')
                    $image = imagecreatefromjpeg($source);

                elseif ($info['mime'] == 'image/gif')
                    $image = imagecreatefromgif($source);

                elseif ($info['mime'] == 'image/png')
                    $image = imagecreatefrompng($source);


                if ($width > 750) {
                    $aspectRatio = $width / $height;
                    $imageResized = imagescale($image, 750, 750 / $aspectRatio);
                } else {
                    $imageResized = $image;
                }

                if (!empty($exif['Orientation'])) {
                    switch ($exif['Orientation']) {
                        case 8:
                            $imageResized = imagerotate($imageResized, 90, 0);
                            break;
                        case 3:
                            $imageResized = imagerotate($imageResized, 180, 0);
                            break;
                        case 6:
                            $imageResized = imagerotate($imageResized, -90, 0);
                            break;
                    }
                }
                imagejpeg($imageResized, $source);
                break;
            }
        } while (true);
    }
}
