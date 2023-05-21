<?php

class ProductsGateway
{
    public function __construct(Database $database)
    {
        $this->conn = $database->getConnection();
        include(dirname(__FILE__) . '/../publicFolderPath.php');
        $this->path = $path;
    }

    public function get(string $id): array
    {
        //product
        $sql = "SELECT * FROM products WHERE id = :id LIMIT 1";
        $stmt = $this->conn->prepare($sql);
        $stmt->execute([
            'id' => $id
        ]);
        $data = $stmt->fetch(PDO::FETCH_ASSOC);

        //images
        $sql_images = "SELECT * FROM product_images WHERE product_id = :id ORDER BY i_order";
        $stmt = $this->conn->prepare($sql_images);
        $stmt->execute([
            'id' => $id
        ]);
        $images = [];
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $images[] = $row;
        }
        $data["images"] = $images;

        //manufacturer
        $sql_manufacturer = "SELECT * FROM product_manufacturers WHERE id = :id LIMIT 1";
        $stmt = $this->conn->prepare($sql_manufacturer);
        $stmt->execute([
            'id' => $data["manufacturer_id"]
        ]);
        $data["manufacturer_name"] = $stmt->fetch(PDO::FETCH_ASSOC);

        //categories
        $sql_categories = "SELECT * FROM product_categories WHERE product_id = :id";
        $stmt = $this->conn->prepare($sql_categories);
        $stmt->execute([
            'id' => $id
        ]);
        $categories = [];
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $sql_category = "SELECT * FROM products_category WHERE id = :id LIMIT 1";
            $stmt_inner = $this->conn->prepare($sql_category);
            $stmt_inner->execute([
                'id' => $row["category_id"]
            ]);
            $category = [];
            $category = $stmt_inner->fetch(PDO::FETCH_ASSOC);
            $category["ref_id"] = $row["id"];
            $categories[] = $category;
        }
        $data["categories"] = $categories;

        //variants
        $sql_variants = "SELECT * FROM product_variants WHERE product_id = :id ORDER BY v_order";
        $stmt = $this->conn->prepare($sql_variants);
        $stmt->execute([
            'id' => $id
        ]);
        $variants = [];
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $variants[] = $row;
        }
        $data["variants"] = $variants;

        return $data;
    }

    function getAll($offset): array
    {
        $sql = "SELECT * FROM products LIMIT 5 OFFSET :offset";
        $stmt = $this->conn->prepare($sql);

        $stmt->execute([
            'offset' => $offset
        ]);

        $data = [];
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $sql_product_image = "SELECT name FROM product_images WHERE product_id= :id AND i_order = 0 LIMIT 1";
            $stmt = $this->conn->prepare($sql_product_image);

            $stmt->execute([
                'id' => $row["id"]
            ]);
            $image = $stmt->fetch(PDO::FETCH_ASSOC);
            $row["image"] = $image["name"];
            $data[] = $row;
        }

        return $data;
    }

    public function create(array $data): bool
    {
        $sql = "INSERT INTO products (name, description, manufacturer_id, detail, active) VALUES (:name, :description, :manufacturer_id, :detail, :active)";
        $stmt = $this->conn->prepare($sql);

        $stmt->execute([
            'name' => $data["name"],
            'description' => $data["description"],
            'manufacturer_id' => $data["manufacturer_id"],
            'detail' => $data["detail"],
            'active' => $data["active"]
        ]);

        $last_id = $this->conn->lastInsertId();

        $images = $data["new_images"];

        foreach ($images as $image) {
            $this->createImage($image["file"], $last_id, $image["order"]);
        }

        $variants = $data["variants"];
        $index = 0;
        foreach ($variants as $var) {
            $sqlVariant = "INSERT INTO product_variants (product_id, name, price, in_stock, v_order, parameters) VALUES (:product_id, :name, :price, :in_stock, :v_order, :parameters)";
            $stmt = $this->conn->prepare($sqlVariant);

            $stmt->execute([
                'product_id' => $last_id,
                'name' => $var["name"],
                'price' => $var["price"],
                'in_stock' => $var["in_stock"],
                'v_order' => $var["v_order"],
                'parameters' => json_encode($data["params"][$index])
            ]);
            ++$index;
        }

        foreach ($data["categories"] as $category) {
            $sqlCatogory = "INSERT INTO product_categories (product_id, category_id) VALUES (:product_id, :category_id)";
            $stmt = $this->conn->prepare($sqlCatogory);

            $stmt->execute([
                'product_id' => $last_id,
                'category_id' => $category["id"]
            ]);
        }


        return true;
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

        //insert and create newly added images
        $new_images = $data["new_images"];
        foreach ($new_images as $image) {
            $this->createImage($image["file"], $data["id"], $image["order"]);
        }

        //update existing images
        $images = $data["images"];
        foreach ($images as $image) {
            $sql_update_image = "UPDATE product_images SET i_order= :i_order WHERE id = :id";
            $stmt = $this->conn->prepare($sql_update_image);

            $stmt->execute([
                'i_order' => $image["i_order"],
                'id' => $image["id"]
            ]);
        }

        //variants (delete all previous and insert new)
        $sql_variants = "DELETE FROM product_variants WHERE product_id = :id";
        $stmt = $this->conn->prepare($sql_variants);
        $stmt->execute([
            'id' => $data["id"]
        ]);

        $variants = $data["variants"];
        $index = 0;
        foreach ($variants as $var) {
            $sqlVariant = "INSERT INTO product_variants (product_id, name, price, in_stock, v_order, parameters) VALUES (:product_id, :name, :price, :in_stock, :v_order, :parameters)";
            $stmt = $this->conn->prepare($sqlVariant);

            $stmt->execute([
                'product_id' => $data["id"],
                'name' => $var["name"],
                'price' => $var["price"],
                'in_stock' => $var["in_stock"],
                'v_order' => $var["v_order"],
                'parameters' => json_encode($data["params"][$index])
            ]);
            ++$index;
        }

        //categories (delete all previous and insert current)
        $sql_categories = "DELETE FROM product_categories WHERE product_id = :id";
        $stmt = $this->conn->prepare($sql_categories);
        $stmt->execute([
            'id' => $data["id"]
        ]);

        foreach ($data["categories"] as $category) {
            $sqlCatogory = "INSERT INTO product_categories (product_id, category_id) VALUES (:product_id, :category_id)";
            $stmt = $this->conn->prepare($sqlCatogory);

            $stmt->execute([
                'product_id' => $data["id"],
                'category_id' => $category["id"]
            ]);
        }

        return true;
    }

    public function delete(string $id): int
    {
        $sql = "DELETE FROM products WHERE id = :id";

        $stmt = $this->conn->prepare($sql);

        $stmt->bindValue(":id", $id, PDO::PARAM_INT);

        $stmt->execute();

        //images
        $sql_images = "SELECT * FROM product_images WHERE product_id = :id";
        $stmt_images = $this->conn->prepare($sql_images);

        $stmt_images->execute([
            'id' => $id
        ]);

        while ($row = $stmt_images->fetch(PDO::FETCH_ASSOC)) {
            $sql_row = "DELETE FROM product_images WHERE id = :id";

            $stmt = $this->conn->prepare($sql_row);

            $stmt->bindValue(":id", $row["id"], PDO::PARAM_INT);

            $stmt->execute();

            if (file_exists("{$this->path}/images/products/{$row['name']}")) {
                unlink("{$this->path}/images/products/{$row['name']}");
            }
        }

        //variants
        $sql_variants = "DELETE FROM product_variants WHERE product_id = :id";

        $stmt = $this->conn->prepare($sql_variants);

        $stmt->execute([
            'id' => $id
        ]);

        //categories
        $sql_variants = "DELETE FROM product_categories WHERE product_id = :id";

        $stmt = $this->conn->prepare($sql_variants);

        $stmt->execute([
            'id' => $id
        ]);

        return true;
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

        $sql = "INSERT INTO product_images (name, i_order, product_id) VALUES (:name, :i_order, :product_id)";
        $stmt = $this->conn->prepare($sql);

        $stmt->execute([
            'name' => "{$image_name}.{$imageExtension}",
            'i_order' => $order,
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

    public function deleteImageWithUpdate($image_name, $product_id)
    {
        $this->deleteImage($image_name);
        $this->updateImagesIndexes($product_id);
    }

    private function updateImagesIndexes($product_id)
    {
        $sql_images = "SELECT * FROM product_images WHERE product_id = :id ORDER BY i_order";
        $stmt = $this->conn->prepare($sql_images);
        $stmt->execute([
            'id' => $product_id
        ]);

        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $i_order = $row["i_order"];
            if ($i_order != 0) {
                --$i_order;
            }

            $sql_image = "UPDATE product_images SET i_order = :order WHERE id = :id";
            $stmt = $this->conn->prepare($sql_image);
            $stmt->execute([
                'i_order' => $i_order,
                'id' => $row["id"]
            ]);
        }
    }
}
