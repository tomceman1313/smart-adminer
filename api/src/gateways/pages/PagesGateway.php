<?php

class PagesGateway
{
    public function __construct(Database $database)
    {
        $this->conn = $database->getConnection();
        include(dirname(__FILE__) . '/../../publicFolderPath.php');
        $this->path = $path;
    }

    function getAll(): array
    {
        $sql = "SELECT * FROM pages";
        $stmt = $this->conn->query($sql);

        $data = [];
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $sql_config = "SELECT * FROM pages_config WHERE page_id = :page_id LIMIT 1";
            $stmt_config = $this->conn->prepare($sql_config);
            $stmt_config->execute([
                'page_id' => $row["id"]
            ]);

            $page_config = $stmt_config->fetch(PDO::FETCH_ASSOC);
            $row["config"] = $page_config;

            $data[] = $row;
        }

        return $data;
    }

    public function get(string $name): array
    {
        $sql = "SELECT * FROM pages WHERE name = :name LIMIT 1";
        $stmt = $this->conn->prepare($sql);

        $stmt->execute([
            'name' => $name
        ]);

        $data = $stmt->fetch(PDO::FETCH_ASSOC);

        $sql_config = "SELECT * FROM pages_config WHERE page_id = :page_id LIMIT 1";
        $stmt_config = $this->conn->prepare($sql_config);
        $stmt_config->execute([
            'page_id' => $data["id"]
        ]);

        $page_config = $stmt_config->fetch(PDO::FETCH_ASSOC);
        $data["config"] = $page_config;
        return $data;
    }

    public function getAllPageParts(string $page): array
    {
        $sql = "SELECT * FROM pages WHERE page_name = :page_name";
        $stmt = $this->conn->prepare($sql);

        $stmt->execute([
            'page_name' => $page
        ]);

        $data = [];
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $data[$row["name"]] = $row;
        }

        return $data;
    }

    public function update(array $data)
    {
        $new_image_name = "";
        if (isset($data["prev_image"])) {
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
            file_put_contents("{$this->path}/images/pages/{$image_name}.{$imageExtension}", $decodedImageData);

            if (file_exists("{$this->path}/images/pages/{$data["prev_image"]}")) {
                unlink("{$this->path}/images/pages/{$data["prev_image"]}");
            }

            $this->compress($image_name . "." . $imageExtension);
            $new_image_name = "{$image_name}.{$imageExtension}";
        }

        $sql = "UPDATE pages SET title = :title, description = :description, body = :body, image = :image WHERE id = :id";
        $stmt = $this->conn->prepare($sql);

        $stmt->execute([
            'title' => isset($data["title"]) ? $data["title"] : "",
            'description' => isset($data["description"]) ? $data["description"] : "",
            'body' => $data["body"],
            'image' => isset($data["prev_image"]) ? $new_image_name : $data["image"],
            'id' => $data["id"]
        ]);

        if (isset($data["inner_images"])) {
            $innerImages = $data["inner_images"];
            foreach ($innerImages as $image) {
                $this->createImage($image["name"], $image["file"], $data["id"], "inner");
            }
        }

        if (isset($data["deleted_images"])) {
            $deletedImages = $data["deleted_images"];
            foreach ($deletedImages as $image) {
                $this->deleteImage($image);
            }
        }
    }

    private function createImage($image_name, $base64, $page_id)
    {
        $base64DataString = $base64;
        list($dataType, $imageData) = explode(';', $base64DataString);
        // image file extension
        $imageExtension = explode('/', $dataType)[1];
        // base64-encoded image data
        list(, $encodedImageData) = explode(',', $imageData);
        // decode base64-encoded image data
        $decodedImageData = base64_decode($encodedImageData);

        file_put_contents("{$this->path}/images/pages/{$image_name}.{$imageExtension}", $decodedImageData);

        $this->compress($image_name . "." . $imageExtension);

        $sql = "INSERT INTO page_images (name, page_id) VALUES (:name, :page_id)";
        $stmt = $this->conn->prepare($sql);

        $stmt->execute([
            'name' => "{$image_name}.{$imageExtension}",
            'page_id' => $page_id
        ]);
    }

    public function deleteImage($image_name)
    {
        $sql = "DELETE FROM page_images WHERE name = :name";
        $stmt = $this->conn->prepare($sql);

        $stmt->execute([
            'name' => $image_name
        ]);

        if (file_exists("{$this->path}/images/pages/{$image_name}")) {
            unlink("{$this->path}/images/pages/{$image_name}");
        }
    }

    private function compress($imageName)
    {
        $source = "{$this->path}/images/pages/{$imageName}";
        // $quality = 75;
        set_time_limit(10);
        do {
            if (file_exists($source)) {
                $info = getimagesize($source);
                $width = $info[0];
                $height = $info[1];
                @$exif = exif_read_data($source);

                if ($info['mime'] == 'image/jpeg')
                    $image = imagecreatefromjpeg($source);

                elseif ($info['mime'] == 'image/gif')
                    $image = imagecreatefromgif($source);

                elseif ($info['mime'] == 'image/png')
                    $image = imagecreatefrompng($source);


                if ($width > 1400) {
                    $aspectRatio = $width / $height;
                    $imageResized = imagescale($image, 1400, 1400 / $aspectRatio);
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
                if ($info['mime'] == 'image/jpeg')
                    imagejpeg($imageResized, $source);
                elseif ($info['mime'] == 'image/gif')
                    imagegif($imageResized, $source);
                elseif ($info['mime'] == 'image/png') {
                    imagesavealpha($imageResized, true);
                    imagepng($imageResized, $source);
                } else
                    imagejpeg($imageResized, $source);
                break;
            }
        } while (true);
    }
}
