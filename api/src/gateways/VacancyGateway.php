<?php

class VacancyGateway
{
    public function __construct(Database $database)
    {
        $this->conn = $database->getConnection();
        include(dirname(__FILE__) . '/../publicFolderPath.php');
        $this->path = $path;
    }

    public function create(array $data)
    {
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
        file_put_contents("{$this->path}/images/vacancies/{$image_name}.{$imageExtension}", $decodedImageData);

        $this->compress($image_name . "." . $imageExtension);

        $sql = "INSERT INTO vacancies (title, description, detail, date, active, image) VALUES (:title, :description, :detail, :date, :active, :image)";
        $stmt = $this->conn->prepare($sql);

        $stmt->execute([
            'title' => $data["title"],
            'description' => $data["description"],
            'detail' => $data["detail"],
            'date' => $data["date"],
            'active' => $data["active"],
            'image' => $image_name . "." . $imageExtension
        ]);
    }

    public function get($id)
    {
        $sql = "SELECT * FROM vacancies WHERE id = :id LIMIT 1";
        $stmt = $this->conn->prepare($sql);

        $stmt->execute([
            'id' => $id
        ]);

        $data = $stmt->fetch(PDO::FETCH_ASSOC);
        return $data;
    }

    public function update(array $data, $id): bool
    {
        if (isset($data["image"])) {
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
            file_put_contents("{$this->path}/images/vacancies/{$image_name}.{$imageExtension}", $decodedImageData);
            $this->compress($image_name . "." . $imageExtension);

            if (file_exists("{$this->path}/images/vacancies/{$data["previous_image"]}")) {
                unlink("{$this->path}/images/vacancies/{$data["previous_image"]}");
            }

            $sql = "UPDATE vacancies SET title = :title, description = :description, detail = :detail,
                date = :date, active = :active, image = :image WHERE id = :id";

            $stmt = $this->conn->prepare($sql);

            $stmt->execute([
                'title' => $data["title"],
                'description' => $data["description"],
                'detail' => $data["detail"],
                'date' => $data["date"],
                'active' => $data["active"],
                'image' => $image_name . "." . $imageExtension,
                'id' => $id
            ]);
        }

        $sql = "UPDATE vacancies SET title = :title, description = :description, detail = :detail,
         date = :date, active = :active WHERE id = :id";

        $stmt = $this->conn->prepare($sql);

        $stmt->execute([
            'title' => $data["title"],
            'description' => $data["description"],
            'detail' => $data["detail"],
            'date' => $data["date"],
            'active' => $data["active"],
            'id' => $id
        ]);

        return true;
    }

    public function delete($id)
    {
        $vacancy = $this->get($id);

        if (!$vacancy) {
            return false;
        }

        $imageName = $vacancy["image"];

        if (file_exists("{$this->path}/images/vacancies/{$imageName}")) {
            unlink("{$this->path}/images/vacancies/{$imageName}");
        }

        $sql = "DELETE FROM vacancies WHERE id = :id";

        $stmt = $this->conn->prepare($sql);

        $stmt->bindValue(":id", $id, PDO::PARAM_INT);

        $stmt->execute();


        return true;
    }

    function getAll(): array
    {
        $sql = "SELECT * FROM vacancies";
        $stmt = $this->conn->query($sql);

        $data = [];
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $data[] = $row;
        }

        return $data;
    }

    private function compress($imageName)
    {
        $source = "{$this->path}/images/vacancies/{$imageName}";
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


                if ($width > 1920) {
                    $aspectRatio = $width / $height;
                    $imageResized = imagescale($image, 1920, 1920 / $aspectRatio);
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
