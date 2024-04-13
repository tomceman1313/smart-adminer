<?php

class ProductsGateway
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
        //product
        $sql = "SELECT p.*, pm.name as manufacturer_name FROM products as p JOIN product_manufacturers as pm ON p.manufacturer_id = pm.id WHERE p.id = :id LIMIT 1";
        $stmt = $this->conn->prepare($sql);
        $stmt->execute([
            'id' => $id
        ]);
        $data = $stmt->fetch(PDO::FETCH_ASSOC);

        //images
        $images = [];
        $sql_images = "SELECT id, name, i_order FROM product_images WHERE product_id = :id ORDER BY i_order";
        $stmt = $this->conn->prepare($sql_images);
        $stmt->execute([
            'id' => $id
        ]);

        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $images[] = $row;
        }
        $data["images"] = $images;

        //categories
        $categories = [];
        $sql_categories = "SELECT products_category.* FROM product_categories JOIN products_category ON product_categories.category_id = products_category.id WHERE product_categories.product_id = :id";
        $stmt = $this->conn->prepare($sql_categories);
        $stmt->execute([
            'id' => $id
        ]);

        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $categories[] = $row;
        }
        $data["categories"] = $categories;

        //variants & parameters
        $sql_variants = "SELECT * FROM product_variant WHERE product_id = :id ORDER BY v_order";
        $stmt = $this->conn->prepare($sql_variants);
        $stmt->execute([
            'id' => $id
        ]);
        $variants = [];
        $parameters = [];
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $sql_params = "SELECT * FROM product_parameter WHERE variant_id = :id ORDER BY p_order";
            $stmt_params = $this->conn->prepare($sql_params);
            $stmt_params->execute([
                'id' => $row["id"]
            ]);
            $params = [];
            while ($param = $stmt_params->fetch(PDO::FETCH_ASSOC)) {
                $params[] = $param;
            }
            $variant_params = [];
            $variant_params["variant"] = $row["name"];
            $variant_params["params"] = $params;
            $parameters[] = $variant_params;
            $variants[] = $row;
        }
        $data["variants"] = $variants;
        $data["parameters"] = $parameters;

        return $data;
    }

    function getAll(): array
    {
        $sql = "SELECT * FROM products ORDER BY id DESC";
        $stmt = $this->conn->prepare($sql);

        $stmt->execute();

        $data = [];
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $sql_product_image = "SELECT name FROM product_images WHERE product_id= :id AND i_order = 0 LIMIT 1";
            $stmt_image = $this->conn->prepare($sql_product_image);

            $stmt_image->execute([
                'id' => $row["id"]
            ]);
            $image = $stmt_image->fetch(PDO::FETCH_ASSOC);

            $sql_product_price = "SELECT price FROM product_variant WHERE product_id= :id AND v_order = 0 LIMIT 1";
            $stmt_price = $this->conn->prepare($sql_product_price);

            $stmt_price->execute([
                'id' => $row["id"]
            ]);
            $price = $stmt_price->fetch(PDO::FETCH_ASSOC);


            $row["image"] = $image["name"];
            $row["price"] = $price["price"];
            $data[] = $row;
        }

        return $data;
    }

    function getByCategory($id): array
    {
        $sql = "SELECT products.* FROM product_categories INNER JOIN products ON products.id = product_categories.product_id WHERE category_id = :id";
        $stmt = $this->conn->prepare($sql);

        $stmt->execute([
            'id' => $id
        ]);

        $data = [];
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $sql_product_image = "SELECT name FROM product_images WHERE product_id= :id AND i_order = 0 LIMIT 1";
            $stmt_image = $this->conn->prepare($sql_product_image);

            $stmt_image->execute([
                'id' => $row["id"]
            ]);
            $image = $stmt_image->fetch(PDO::FETCH_ASSOC);

            $sql_product_price = "SELECT price FROM product_variant WHERE product_id= :id AND v_order = 0 LIMIT 1";
            $stmt_price = $this->conn->prepare($sql_product_price);

            $stmt_price->execute([
                'id' => $row["id"]
            ]);
            $price = $stmt_price->fetch(PDO::FETCH_ASSOC);


            $row["image"] = $image["name"];
            $row["price"] = $price["price"];
            $data[] = $row;
        }

        return $data;
    }

    /** 
     * * Get product by i
     */
    public function getByName($name)
    {
        $sql = "SELECT * FROM products WHERE name LIKE :name";
        $stmt = $this->conn->prepare($sql);

        $stmt->execute([
            'name' => "%" . $name . "%"
        ]);

        $data = [];
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $sql_product_image = "SELECT name FROM product_images WHERE product_id= :id AND i_order = 0 LIMIT 1";
            $stmt_image = $this->conn->prepare($sql_product_image);

            $stmt_image->execute([
                'id' => $row["id"]
            ]);
            $image = $stmt_image->fetch(PDO::FETCH_ASSOC);

            $sql_product_price = "SELECT price FROM product_variant WHERE product_id= :id AND v_order = 0 LIMIT 1";
            $stmt_price = $this->conn->prepare($sql_product_price);

            $stmt_price->execute([
                'id' => $row["id"]
            ]);
            $price = $stmt_price->fetch(PDO::FETCH_ASSOC);


            $row["image"] = $image["name"];
            $row["price"] = $price["price"];
            $data[] = $row;
        }

        return $data;
    }

    function getByIds($data): array
    {
        $variants_ids = implode(",", array_map(function ($item) {
            return $item['variant_id'];
        }, $data));

        $sql_variants = "SELECT * FROM product_variant WHERE id in (" . $variants_ids . ")";
        $stmt_variants = $this->conn->prepare($sql_variants);

        $stmt_variants->execute();

        $data = [];
        while ($row = $stmt_variants->fetch(PDO::FETCH_ASSOC)) {
            $sql = "SELECT * FROM products WHERE id = :id";
            $stmt = $this->conn->prepare($sql);
            $stmt->execute([
                "id" => $row["product_id"]
            ]);
            $product_data = $stmt->fetch(PDO::FETCH_ASSOC);

            $sql_product_image = "SELECT name FROM product_images WHERE product_id= :id AND i_order = 0 LIMIT 1";
            $stmt_image = $this->conn->prepare($sql_product_image);

            $stmt_image->execute([
                'id' => $row["product_id"]
            ]);
            $image = $stmt_image->fetch(PDO::FETCH_ASSOC);

            $product_data["image"] = $image["name"];
            $product_data["variant"] = $row;
            $data[] = $product_data;
        }



        return $data;
    }

    public function filterProducts($filterData): array
    {
        $query = "SELECT products.* FROM products INNER JOIN product_categories ON product_categories.product_id = products.id";

        $sql = [];
        $values = [];

        if (isset($filterData["manufacturers"]) && count($filterData["manufacturers"]) > 0) {
            $in = join(',', array_fill(0, count($filterData["manufacturers"]), '?'));
            $sql[] = " manufacturer_id IN ( $in )";
            array_push($values, ...$filterData["manufacturers"]);
        }

        if (isset($filterData["categories"]) && count($filterData["categories"]) > 0) {
            $in = join(',', array_fill(0, count($filterData["categories"]), '?'));
            $sql[] = " product_categories.category_id IN ( $in )";
            array_push($values, ...$filterData["categories"]);
        }

        if ($sql) {
            $query .= ' WHERE' . implode(' AND ', $sql);
        }

        //$query .= " ORDER BY o.order_date";

        $stmt = $this->conn->prepare($query);

        $stmt->execute($values);

        $data = [];
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $sql_product_image = "SELECT name FROM product_images WHERE product_id= :id AND i_order = 0 LIMIT 1";
            $stmt_image = $this->conn->prepare($sql_product_image);

            $stmt_image->execute([
                'id' => $row["id"]
            ]);
            $image = $stmt_image->fetch(PDO::FETCH_ASSOC);

            $sql_product_price = "SELECT price FROM product_variant WHERE product_id= :id AND v_order = 0 LIMIT 1";
            $stmt_price = $this->conn->prepare($sql_product_price);

            $stmt_price->execute([
                'id' => $row["id"]
            ]);
            $price = $stmt_price->fetch(PDO::FETCH_ASSOC);


            $row["image"] = $image["name"];
            $row["price"] = $price["price"];
            $data[] = $row;
        }

        return $data;
    }


    public function create(array $data)
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
            $this->createImage(uniqid(), $image["file"], $last_id, $image["order"]);
        }

        $innerImages = $data["innerImages"];
        foreach ($innerImages as $image) {
            $this->createImage($image["name"], $image["file"], $last_id, -1);
        }

        $variants = $data["variants"];
        foreach ($variants as $var) {
            $sqlVariant = "INSERT INTO product_variant (product_id, name, price, in_stock, v_order) VALUES (:product_id, :name, :price, :in_stock, :v_order)";
            $stmt = $this->conn->prepare($sqlVariant);

            $stmt->execute([
                'product_id' => $last_id,
                'name' => $var["name"],
                'price' => $var["price"],
                'in_stock' => $var["in_stock"],
                'v_order' => $var["v_order"],
            ]);
            $variant_id = $this->conn->lastInsertId();

            foreach ($var["parameters"]["params"] as $param) {
                $sql_param = "INSERT INTO product_parameter (variant_id, name, value, p_order) VALUES (:variant_id, :name, :value, :p_order)";
                $stmt_param = $this->conn->prepare($sql_param);
                $stmt_param->execute([
                    'variant_id' => $variant_id,
                    'name' => $param["name"],
                    'value' => $param["value"],
                    'p_order' => $param["p_order"],
                ]);
            }
        }

        foreach ($data["categories"] as $category) {
            $sql_category = "INSERT INTO product_categories (product_id, category_id) VALUES (:product_id, :category_id)";
            $stmt = $this->conn->prepare($sql_category);

            $stmt->execute([
                'product_id' => $last_id,
                'category_id' => $category["id"]
            ]);
        }
    }

    public function update(array $data)
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
            $this->createImage(uniqid(), $image["file"], $data["id"], $image["order"]);
        }

        $innerImages = $data["innerImages"];
        foreach ($innerImages as $image) {
            $this->createImage($image["name"], $image["file"], $data["id"], -1);
        }

        $deletedImages = $data["deletedImages"];
        foreach ($deletedImages as $image) {
            $this->deleteImageByName($image);
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
        $sql_variants = "DELETE v.*, p.* FROM product_variant AS v LEFT JOIN product_parameter AS p ON p.variant_id = v.id WHERE v.product_id = :id";
        $stmt = $this->conn->prepare($sql_variants);
        $stmt->execute([
            'id' => $data["id"]
        ]);

        $variants = $data["variants"];
        foreach ($variants as $var) {
            $sqlVariant = "INSERT INTO product_variant (product_id, name, price, in_stock, v_order) VALUES (:product_id, :name, :price, :in_stock, :v_order)";
            $stmt = $this->conn->prepare($sqlVariant);

            $stmt->execute([
                'product_id' => $data["id"],
                'name' => $var["name"],
                'price' => $var["price"],
                'in_stock' => $var["in_stock"],
                'v_order' => $var["v_order"],
            ]);
            $variant_id = $this->conn->lastInsertId();

            foreach ($var["parameters"]["params"] as $param) {
                $sql_param = "INSERT INTO product_parameter (variant_id, name, value, p_order) VALUES (:variant_id, :name, :value, :p_order)";
                $stmt_param = $this->conn->prepare($sql_param);
                $stmt_param->execute([
                    'variant_id' => $variant_id,
                    'name' => $param["name"],
                    'value' => $param["value"],
                    'p_order' => $param["p_order"],
                ]);
            }
        }

        //categories (delete all previous and insert current)
        $sql_categories = "DELETE FROM product_categories WHERE product_id = :id";
        $stmt = $this->conn->prepare($sql_categories);
        $stmt->execute([
            'id' => $data["id"]
        ]);

        foreach ($data["categories"] as $category) {
            $sql_category = "INSERT INTO product_categories (product_id, category_id) VALUES (:product_id, :category_id)";
            $stmt = $this->conn->prepare($sql_category);

            $stmt->execute([
                'product_id' => $data["id"],
                'category_id' => $category["id"]
            ]);
        }

        return;
    }

    public function delete(string $id)
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

        $sql_images = "DELETE FROM product_images WHERE product_id = :id";
        $stmt = $this->conn->prepare($sql_images);
        $stmt->execute([
            "id" => $id
        ]);

        while ($row = $stmt_images->fetch(PDO::FETCH_ASSOC)) {
            if (file_exists("{$this->path}/images/products/{$row['name']}")) {
                unlink("{$this->path}/images/products/{$row['name']}");
            }
        }

        //variants
        $sql_variants = "DELETE v.*, p.* FROM product_variant AS v LEFT JOIN product_parameter AS p ON p.variant_id = v.id WHERE v.product_id = :id";
        $stmt = $this->conn->prepare($sql_variants);
        $stmt->execute([
            'id' => $id
        ]);

        //categories
        $sql = "DELETE FROM product_categories WHERE product_id = :id";
        $stmt = $this->conn->prepare($sql);
        $stmt->execute([
            'id' => $id
        ]);

        return;
    }

    private function createImage($image_name, $base64, $product_id, $order)
    {
        $image_name_result = $this->utils->createImage($base64, 1200, "/images/products", $image_name);

        $sql = "INSERT INTO product_images (name, i_order, product_id) VALUES (:name, :i_order, :product_id)";
        $stmt = $this->conn->prepare($sql);

        $stmt->execute([
            'name' => $image_name_result,
            'i_order' => $order,
            'product_id' => $product_id
        ]);
    }

    private function deleteImageByName($image_name)
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

    public function deleteImageWithUpdate($image_id, $product_id)
    {
        $sql = "SELECT name FROM product_images WHERE id = :id LIMIT 1";
        $stmt = $this->conn->prepare($sql);
        $stmt->execute([
            'id' => $image_id
        ]);

        $image = $stmt->fetch(PDO::FETCH_ASSOC);


        $sql = "DELETE FROM product_images WHERE name = :name";
        $stmt = $this->conn->prepare($sql);

        $stmt->execute([
            'name' => $image["name"]
        ]);

        if (file_exists("{$this->path}/images/products/{$image["name"]}")) {
            unlink("{$this->path}/images/products/{$image["name"]}");
        }


        $this->updateImagesIndexes($product_id);
    }

    private function updateImagesIndexes($product_id)
    {
        $sql_images = "SELECT * FROM product_images WHERE product_id = :id ORDER BY i_order";
        $stmt = $this->conn->prepare($sql_images);
        $stmt->execute([
            'id' => $product_id
        ]);
        $order = 0;
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $i_order = $row["i_order"];
            if ($i_order != 0) {
                --$i_order;
            }

            $sql_image = "UPDATE product_images SET i_order = :order WHERE id = :id";
            $stmt_inner = $this->conn->prepare($sql_image);
            $stmt_inner->execute([
                'order' => $order,
                'id' => $row["id"]
            ]);
            ++$order;
        }
    }

    public function checkNameAvailability($name)
    {
        $sql = "SELECT COUNT(1) FROM products WHERE name = :name";
        $stmt = $this->conn->prepare($sql);

        $stmt->execute([
            'name' => $name
        ]);

        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        if ($result["COUNT(1)"] == 0) {
            return true;
        }
        return false;
    }
}
