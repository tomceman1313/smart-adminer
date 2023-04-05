<?php

class ProductsGateway
{
    public function __construct(Database $database)
    {
        $this->conn = $database->getConnection();
        include(dirname(__FILE__) . '/../publicFolderPath.php');
        $this->path = $path;
    }


    public function create(array $data): bool
    {
        $sql = "INSERT INTO products (name, description, detail, manufacturer_id, active) VALUES (:name, :description, :detail, :active)";
        $stmt = $this->conn->prepare($sql);

        $stmt->execute([
            'name' => $data["name"],
            'description' => $data["description"],
            'detail' => $data["detail"],
            'manufacturer_id' => $data["manufacturer_id"],
            'active' => $data["active"]
        ]);

        $last_id = $this->conn->lastInsertId();

        $images = $data["images"];

        foreach ($images as $image) {
            $this->createImage($image["file"], $last_id, $image["order"]);
        }

        return true;
    }

    public function get(string $id): array
    {
        $sql = "SELECT * FROM products WHERE id = :id LIMIT 1";
        $stmt = $this->conn->prepare($sql);

        $stmt->execute([
            'id' => $id
        ]);

        $data = $stmt->fetch(PDO::FETCH_ASSOC);

        $sql = "SELECT * FROM product_images WHERE product_id = :id AND ORDER BY order";
        $stmt = $this->conn->prepare($sql);

        $stmt->execute([
            'id' => $id
        ]);

        $images = [];
        // boolean values have to converted manualy, represented by 0/1 by default
        // $row["bool column"] = (bool) $row["bool column];
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $images[] = $row;
        }
        $data["images"] = $images;
        return $data;
    }

    function getAll($offset): array
    {
        $sql = "SELECT * FROM products LIMIT 25 OFFSET :offset";
        $stmt = $this->conn->prepare($sql);

        $stmt->execute([
            'offset' => $offset
        ]);

        $data = [];
        // boolean values have to converted manualy, represented by 0/1 by default
        // $row["bool column"] = (bool) $row["bool column];
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $data[] = $row;
        }

        return $data;
    }

    public function update(array $data): bool
    {

        $sql = "UPDATE products SET name = :name, description = :description, 
            detail = :detail, manufacturer_id = :manufacturer_id, active = :active WHERE id = :id";

        $stmt = $this->conn->prepare($sql);

        $stmt->execute([
            'name' => $data["name"],
            'description' => $data["description"],
            'detail' => $data["detail"],
            'manufacturer_id' => $data["manufacturer_id"],
            'active' => $data["active"],
            'id' => $data["id"]
        ]);

        $images = $data["images"];

        foreach ($images as $image) {
            $this->createImage($image["file"], $data["id"], $image["order"]);
        }

        $deletedImages = $data["deletedImages"];

        foreach ($deletedImages as $image) {
            $this->deleteImage($image);
        }


        return true;
    }

    public function delete(string $id): int
    {
        $sql = "DELETE FROM products WHERE id = :id";

        $stmt = $this->conn->prepare($sql);

        $stmt->bindValue(":id", $id, PDO::PARAM_INT);

        $stmt->execute();

        $sql_select = "SELECT * FROM product_images WHERE product_id = :id";
        $stmt_select = $this->conn->prepare($sql_select);

        $stmt_select->execute([
            'id' => $id
        ]);

        while ($row = $stmt_select->fetch(PDO::FETCH_ASSOC)) {
            $sql_row = "DELETE FROM product_images WHERE id = :id";

            $stmt = $this->conn->prepare($sql_row);

            $stmt->bindValue(":id", $row["id"], PDO::PARAM_INT);

            $stmt->execute();

            if (file_exists("{$this->path}/images/products/{$row['name']}")) {
                unlink("{$this->path}/images/products/{$row['name']}");
            }
        }


        return true;
    }



    public function getCategory(string $id): array
    {

        $sql = "SELECT * FROM products_category WHERE id = :id LIMIT 1";
        $stmt = $this->conn->prepare($sql);

        $stmt->execute([
            'id' => $id
        ]);

        $data = $stmt->fetch(PDO::FETCH_ASSOC);
        return $data;
    }

    private function compress($imageName)
    {
        $source = "{$this->path}/images/products/{$imageName}";
        // $quality = 75;
        set_time_limit(10);
        do {
            if (file_exists($source)) {
                $info = getimagesize($source);
                $width = $info[0];
                $height = $info[1];

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

                imagejpeg($imageResized, $source);
                break;
            }
        } while (true);
    }

    private function createImage($base64, $product_id, $order)
    {
        $image_name = uniqid();
        $base64DataString = $base64;
        list($dataType, $imageData) = explode(';', $base64DataString);
        // image file extension
        $imageExtension = explode('/', $dataType)[1];
        // base64-encoded image data
        list(, $encodedImageData) = explode(',', $imageData);
        // decode base64-encoded image data
        $decodedImageData = base64_decode($encodedImageData);

        file_put_contents("{$this->path}/images/products/{$image_name}.{$imageExtension}", $decodedImageData);

        $this->compress($image_name . "." . $imageExtension);

        $sql = "INSERT INTO product_images (name, order, product_id) VALUES (:name, :order, :product_id)";
        $stmt = $this->conn->prepare($sql);

        $stmt->execute([
            'name' => "{$image_name}.{$imageExtension}",
            'order' => $order,
            'product_id' => $product_id
        ]);
    }

    public function deleteImage($image_name)
    {
        $sql = "DELETE FROM product_images WHERE name = :name";
        $stmt = $this->conn->prepare($sql);

        $stmt->execute([
            'name' => $image_name
        ]);

        if (file_exists("{$this->path}/images/products/{$image_name}")) {
            unlink("{$this->path}/images/products/{$image_name}");
        }
    }
}
