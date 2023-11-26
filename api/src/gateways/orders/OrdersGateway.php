<?php
class OrdersGateway
{
    public function __construct(Database $database)
    {
        $this->conn = $database->getConnection();
        $this->email = new EmailsGateway($database);
    }

    public function get(string $id): array
    {
        $sql = "SELECT o.*, os.name as status_name, st.name as shipping_type FROM orders AS o INNER JOIN order_status as os ON o.status_code = os.id INNER JOIN shipping_type as st ON o.shipping_type_id = st.id WHERE o.id = :id LIMIT 1";
        $stmt = $this->conn->prepare($sql);
        $stmt->execute([
            'id' => $id
        ]);
        $data = $stmt->fetch(PDO::FETCH_ASSOC);

        $sql = "SELECT * FROM customers WHERE id = :id LIMIT 1";
        $stmt = $this->conn->prepare($sql);
        $stmt->execute([
            'id' => $data["customer_id"]
        ]);
        $customer = $stmt->fetch(PDO::FETCH_ASSOC);

        //ordered_products
        $ordered_products = [];
        $sql = "SELECT ordered_products.*, products.name as product_name, product_images.name as image FROM ordered_products INNER JOIN products ON ordered_products.product_id = products.id
         INNER JOIN product_images ON product_images.product_id = products.id WHERE ordered_products.order_id = :order_id AND product_images.i_order = 0";
        $stmt = $this->conn->prepare($sql);
        $stmt->execute([
            'order_id' => $id
        ]);

        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $sql_variant = "SELECT name FROM product_variant WHERE id = :variant_id LIMIT 1";
            $stmt_variant = $this->conn->prepare($sql_variant);
            $stmt_variant->execute([
                'variant_id' => $row["variant_id"]
            ]);
            $variant = $stmt_variant->fetch(PDO::FETCH_ASSOC);
            $row["variant_name"] = $variant["name"];
            $ordered_products[] = $row;
        }
        $data["customer"] = $customer;
        $data["ordered_products"] = $ordered_products;

        return $data;
    }

    public function getAll(): array
    {
        $sql = "SELECT o.*, os.name as status_name, os.public_name, st.name as shipping_type FROM orders 
        AS o INNER JOIN order_status as os ON o.status_code = os.id INNER JOIN shipping_type as st ON o.shipping_type_id = st.id";
        $stmt = $this->conn->prepare($sql);

        $stmt->execute();

        $data = [];
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $sql_price_sum = "SELECT SUM(price_piece * quantity) as order_sum_price FROM ordered_products WHERE order_id = :order_id";
            $stmt_price_sum = $this->conn->prepare($sql_price_sum);
            $stmt_price_sum->execute([
                'order_id' => $row["id"]
            ]);

            $price = $stmt_price_sum->fetch(PDO::FETCH_ASSOC);
            $row["price_sum"] = intval($price["order_sum_price"]);
            $data[] = $row;
        }

        return $data;
    }

    public function getStatusCodes(): array
    {
        $sql = "SELECT * FROM order_status";
        $stmt = $this->conn->prepare($sql);

        $stmt->execute();

        $data = [];
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $data[] = $row;
        }

        return $data;
    }

    public function getShippingTypes(): array
    {
        $sql = "SELECT * FROM shipping_type";
        $stmt = $this->conn->prepare($sql);

        $stmt->execute();

        $data = [];
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $data[] = $row;
        }

        return $data;
    }

    public function filterOrders($filterData): array
    {
        $query = "SELECT o.*, os.name as status_name, os.public_name, st.name as shipping_type FROM orders 
        AS o INNER JOIN order_status as os ON o.status_code = os.id INNER JOIN shipping_type as st ON o.shipping_type_id = st.id";

        $sql = [];
        $values = [];

        if (isset($filterData["status"]) && count($filterData["status"]) > 0) {
            $in = join(',', array_fill(0, count($filterData["status"]), '?'));
            $sql[] = " status_code IN ( $in )";
            array_push($values, ...$filterData["status"]);
        }

        if (isset($filterData["order_date"]["start"])) {
            $sql[] = " order_date BETWEEN ? AND ?";
            array_push($values, $filterData["order_date"]["start"]);
            array_push($values, $filterData["order_date"]["end"]);
        }

        if (isset($filterData["shipping_type"]) && count($filterData["shipping_type"]) > 0) {
            $in = join(',', array_fill(0, count($filterData["shipping_type"]), '?'));
            $sql[] = " shipping_type_id IN ( $in )";
            array_push($values, ...$filterData["shipping_type"]);
        }

        if (isset($filterData["payment_method"]) && count($filterData["payment_method"]) > 0) {
            $in = join(',', array_fill(0, count($filterData["payment_method"]), '?'));
            $sql[] = " payment_method IN ( $in )";
            array_push($values, ...$filterData["payment_method"]);
        }

        if ($sql) {
            $query .= ' WHERE' . implode(' AND ', $sql);
        }

        $query .= " ORDER BY o.order_date";

        $stmt = $this->conn->prepare($query);

        $stmt->execute($values);

        $data = [];
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $sql_price_sum = "SELECT SUM(price_piece * quantity) as order_sum_price FROM ordered_products WHERE order_id = :order_id";
            $stmt_price_sum = $this->conn->prepare($sql_price_sum);
            $stmt_price_sum->execute([
                'order_id' => $row["id"]
            ]);

            $price = $stmt_price_sum->fetch(PDO::FETCH_ASSOC);
            $row["price_sum"] = intval($price["order_sum_price"]);
            $data[] = $row;
        }

        return $data;
    }

    public function findById($id): array
    {
        $sql = "SELECT o.*, os.name as status_name, os.public_name, st.name as shipping_type FROM orders 
        AS o INNER JOIN order_status as os ON o.status_code = os.id INNER JOIN shipping_type as st ON o.shipping_type_id = st.id WHERE o.id LIKE :id";
        $stmt = $this->conn->prepare($sql);

        $stmt->execute([
            'id' => $id . "%"
        ]);

        $data = [];
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $sql_price_sum = "SELECT SUM(price_piece * quantity) as order_sum_price FROM ordered_products WHERE order_id = :order_id";
            $stmt_price_sum = $this->conn->prepare($sql_price_sum);
            $stmt_price_sum->execute([
                'order_id' => $row["id"]
            ]);

            $price = $stmt_price_sum->fetch(PDO::FETCH_ASSOC);
            $row["price_sum"] = intval($price["order_sum_price"]);
            $data[] = $row;
        }

        return $data;
    }

    public function create(array $data)
    {
        $sql = "INSERT INTO customers (fname, lname, address, city, postal_code, phone, email, company_name, ic, dic, delivery_fname, delivery_lname, delivery_address, delivery_city, delivery_postal_code) 
        VALUES (:fname, :lname, :address, :city, :postal_code, :phone, :email, :company_name, :ic, :dic, :delivery_fname, :delivery_lname, :delivery_address, :delivery_city, :delivery_postal_code)";
        $stmt = $this->conn->prepare($sql);

        $stmt->execute([
            'fname' => $data["fname"],
            'lname' => $data["lname"],
            'address' => $data["address"],
            'city' => $data["city"],
            'postal_code' => $data["postal_code"],
            'phone' => $data["phone"],
            'email' => $data["email"],
            'company_name' => isset($data["company_name"]) ? $data["company_name"] : "",
            'ic' => isset($data["ic"]) ? $data["ic"] : "",
            'dic' => isset($data["dic"]) ? $data["dic"] : "",
            'delivery_fname' => isset($data["delivery_fname"]) ? $data["delivery_fname"] : "",
            'delivery_lname' => isset($data["delivery_lname"]) ? $data["delivery_lname"] : "",
            'delivery_address' => isset($data["delivery_address"]) ? $data["delivery_address"] : "",
            'delivery_city' => isset($data["delivery_city"]) ? $data["delivery_city"] : "",
            'delivery_postal_code' => isset($data["delivery_postal_code"]) ? $data["delivery_postal_code"] : "",
        ]);

        $customer_id = $this->conn->lastInsertId();
        $sql = "INSERT INTO orders (status_code, payment_method, shipping_type_id, order_date, customer_id, comments) VALUES (:status_code, :payment_method, :shipping_type_id, :order_date, :customer_id, :comments)";
        $stmt = $this->conn->prepare($sql);

        $stmt->execute([
            'status_code' => $data["status_code"],
            'payment_method' => $data["payment_method"],
            'shipping_type_id' => $data["shipping_type_id"],
            'order_date' => $data["order_date"],
            'customer_id' => $customer_id,
            'comments' => $data["comments"]
        ]);

        $order_id = $this->conn->lastInsertId();
        $ordered_products = $data["ordered_products"];

        foreach ($ordered_products as $product) {
            $sqlVariant = "INSERT INTO ordered_products (order_id, product_id, variant_id, price_piece, quantity) VALUES (:order_id, :product_id, :variant_id, :price_piece, :quantity)";
            $stmt = $this->conn->prepare($sqlVariant);

            $stmt->execute([
                'order_id' => $order_id,
                'product_id' => $product["product_id"],
                'variant_id' => $product["variant_id"],
                'price_piece' => $product["price_piece"],
                'quantity' => $product["quantity"],
            ]);
        }

        $this->sendNewOrderEmail($data["email"], $data["fname"] . " " . $data["fname"], $order_id);

        return $order_id;
    }

    public function update(array $data)
    {
        $sql = "UPDATE customers SET fname = :fname, lname = :lname, address = :address, city = :city, postal_code = :postal_code, phone = :phone, email = :email, 
        company_name = :company_name, ic = :ic, dic = :dic, delivery_fname = :delivery_fname, delivery_lname = :delivery_lname, delivery_address = :delivery_address, delivery_city = :delivery_city, 
        delivery_postal_code = :delivery_postal_code WHERE id = :id";

        $stmt = $this->conn->prepare($sql);

        $stmt->execute([
            'id' => $data["customer_id"],
            'fname' => $data["fname"],
            'lname' => $data["lname"],
            'address' => $data["address"],
            'city' => $data["city"],
            'postal_code' => $data["postal_code"],
            'phone' => $data["phone"],
            'email' => $data["email"],
            'company_name' => $data["company_name"],
            'ic' => $data["ic"],
            'dic' => $data["dic"],
            'delivery_fname' => $data["delivery_fname"],
            'delivery_lname' => $data["delivery_lname"],
            'delivery_address' => $data["delivery_address"],
            'delivery_city' => $data["delivery_city"],
            'delivery_postal_code' => $data["delivery_postal_code"]
        ]);

        $sql = "UPDATE orders SET status_code = :status_code, payment_method = :payment_method, shipping_type_id = :shipping_type_id, shipped_date = :shipped_date, completed_date = :completed_date, comments = :comments WHERE id = :id";
        $stmt = $this->conn->prepare($sql);

        $stmt->execute([
            'id' => $data["order_id"],
            'status_code' => $data["status_code"],
            'payment_method' => $data["payment_method"],
            'shipping_type_id' => $data["shipping_type_id"],
            'shipped_date' => $data["shipped_date"],
            'completed_date' => $data["completed_date"],
            'comments' => $data["comments"]
        ]);

        $ordered_products = $data["ordered_products"];

        foreach ($ordered_products as $product) {
            $sql = "UPDATE ordered_products SET price_piece = :price_piece, quantity = :quantity WHERE id = :id";
            $stmt = $this->conn->prepare($sql);

            $stmt->execute([
                'id' => $product["id"],
                'price_piece' => $product["price_piece"],
                'quantity' => $product["quantity"],
            ]);
        }

        $deleted_products = $data["deleted_products"];

        foreach ($deleted_products as $product) {
            $sql = "DELETE FROM ordered_products WHERE id = :id";
            $stmt = $this->conn->prepare($sql);
            $stmt->execute([
                'id' => $product["id"]
            ]);
        }

        // $added_products = $data["added_products"];

        // foreach ($added_products as $product) {
        //     $sqlVariant = "INSERT INTO ordered_products (order_id, product_id, price_piece, quantity) VALUES (:order_id, :product_id, :price_piece, :quantity)";
        //     $stmt = $this->conn->prepare($sqlVariant);

        //     $stmt->execute([
        //         'order_id' => $data["order_id"],
        //         'product_id' => $product["product_id"],
        //         'price_piece' => $product["price_piece"],
        //         'quantity' => $product["quantity"],
        //     ]);
        // }
    }

    public function updateStatus(array $data)
    {
        $sql = "UPDATE orders SET status_code = :status_code WHERE id = :id";
        $stmt = $this->conn->prepare($sql);

        $stmt->execute([
            'id' => $data["id"],
            'status_code' => $data["status_code"]
        ]);
    }

    public function delete(string $id)
    {
        $sql = "DELETE o.*, c.* FROM orders AS o LEFT JOIN customers AS c ON o.customer_id = c.id WHERE o.id = :id";
        $stmt = $this->conn->prepare($sql);
        $stmt->execute([
            'id' => $id
        ]);

        $sql = "DELETE FROM ordered_products WHERE order_id = :id";
        $stmt = $this->conn->prepare($sql);
        $stmt->execute([
            "id" => $id
        ]);
    }

    private function sendNewOrderEmail($email, $name, $orderNumber)
    {
        $emailCustomer = [];
        $emailCustomer["subject"] = "Potvrzení objednávky";
        $emailCustomer["to"] = $email;
        $emailCustomer["name"] = $name;
        $emailCustomer["message"] = "Test message";

        $this->email->sendEmail($emailCustomer);

        $emailAdmin = [];
        $emailAdmin["subject"] = "Nová objednávka č. $orderNumber";
        $emailAdmin["to"] = "tomas@smart-studio.cz";
        $emailAdmin["name"] = "Info";
        $emailAdmin["message"] = "Byla přijata nová objednávka.";

        $this->email->sendEmail($emailAdmin);
    }
}
