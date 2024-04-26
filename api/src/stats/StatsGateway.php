<?php

class StatsGateway
{
    public function __construct(Database $database)
    {
        $this->conn = $database->getConnection();
        include(dirname(__FILE__) . '/../publicFolderPath.php');
        $this->utils = new Utils($database);
        $this->path = $path;
    }


    public function getStats($sections)
    {
        $data = [];
        foreach ($sections as $section) {
            switch ($section) {
                case "articles":
                    $data["articles"] = $this->getArticlesStats();

                case "gallery":
                    $data["gallery"] = $this->getGalleryStats();

                case "documents":
                    $data["documents"] = $this->getDocumentsStats();

                case "employees":
                    $data["orders"] = $this->getEmployeesStats();

                case "orders":
                    $data["orders"] = $this->getOrdersStats();
            }
        }

        return $data;
    }

    private function getArticlesStats()
    {
        $stats = [];

        $sql = "SELECT COUNT(*) FROM articles";
        $stmt = $this->conn->prepare($sql);
        $stmt->execute();
        $stats["total_count"] = $stmt->fetch(PDO::FETCH_ASSOC)["COUNT(*)"];

        $sql = "SELECT COUNT(*) FROM articles WHERE active = 1";
        $stmt = $this->conn->prepare($sql);
        $stmt->execute();
        $stats["active_count"] = $stmt->fetch(PDO::FETCH_ASSOC)["COUNT(*)"];

        return $stats;
    }

    private function getGalleryStats()
    {
        $stats = [];

        $sql = "SELECT COUNT(*) FROM gallery";
        $stmt = $this->conn->prepare($sql);
        $stmt->execute();
        $stats["total_count"] = $stmt->fetch(PDO::FETCH_ASSOC)["COUNT(*)"];

        $sql = "SELECT COUNT(*) FROM gallery_categories";
        $stmt = $this->conn->prepare($sql);
        $stmt->execute();
        $stats["categories_count"] = $stmt->fetch(PDO::FETCH_ASSOC)["COUNT(*)"];

        return $stats;
    }

    private function getDocumentsStats()
    {
        $stats = [];

        $sql = "SELECT COUNT(*) FROM documents";
        $stmt = $this->conn->prepare($sql);
        $stmt->execute();
        $stats["total_count"] = $stmt->fetch(PDO::FETCH_ASSOC)["COUNT(*)"];

        $sql = "SELECT COUNT(*) FROM documents_categories";
        $stmt = $this->conn->prepare($sql);
        $stmt->execute();
        $stats["categories_count"] = $stmt->fetch(PDO::FETCH_ASSOC)["COUNT(*)"];

        return $stats;
    }

    private function getEmployeesStats()
    {
        $stats = [];
        $sql = "SELECT COUNT(*) FROM employees";
        $stmt = $this->conn->prepare($sql);
        $stmt->execute();
        $stats["total_count"] = $stmt->fetch(PDO::FETCH_ASSOC)["COUNT(*)"];

        $sql = "SELECT COUNT(*) FROM employees_departments";
        $stmt = $this->conn->prepare($sql);
        $stmt->execute();
        $stats["departments_count"] = $stmt->fetch(PDO::FETCH_ASSOC)["COUNT(*)"];

        return $stats;
    }

    private function getOrdersStats()
    {
        $stats = [];
        $today = date('Y-m-d');
        $date = strtotime("$today -1 year");
        $date_interval_start = date('Ymd', $date);
        $month = intval(date('m', $date));

        $sql = "SELECT order_status.name, orders.order_date, orders.completed_date, orders.shipped_date FROM orders INNER JOIN order_status ON orders.status_code = order_status.id WHERE orders.order_date > $date_interval_start";
        $stmt = $this->conn->prepare($sql);
        $stmt->execute();

        $data = $stmt->fetchAll();
        $monthly_results = [];
        for ($i = 1; $i < 13; $i++) {
            if ($month > 11) {
                $month = 1;
            } else {
                $month += 1;
            }

            $monthly_results[] = array("month" => $this->utils->getMonthName(intval($month)), "pending_orders" => 0, "shipped_orders" => 0, "completed_orders" => 0, "cancelled_orders" => 0);
            foreach ($data as $order) {
                switch ($order["name"]) {
                    case "pending":
                        if ($this->utils->getMonthNumberFromDateInt($order["order_date"]) == $month) {
                            $monthly_results[count($monthly_results) - 1]["pending_orders"] += 1;
                        }
                        break;

                    case "shipped":
                        if ($this->utils->getMonthNumberFromDateInt($order["shipped_date"]) == $month) {
                            $monthly_results[count($monthly_results) - 1]["shipped_orders"] += 1;
                        }
                        break;

                    case "completed":
                        if ($this->utils->getMonthNumberFromDateInt($order["completed_date"]) == $month) {
                            $monthly_results[count($monthly_results) - 1]["completed_orders"] += 1;
                        }
                        break;

                    case "cancelled":
                        if ($this->utils->getMonthNumberFromDateInt($order["order_date"]) == $month) {
                            $monthly_results[count($monthly_results) - 1]["cancelled_orders"] += 1;
                        }
                }
            }
        }

        $stats["monthly_results"] = $monthly_results;

        $sql = "SELECT COUNT(*) FROM orders INNER JOIN order_status ON orders.status_code = order_status.id";
        $stmt = $this->conn->prepare($sql);
        $stmt->execute();
        $stats["total_count"] = $stmt->fetch(PDO::FETCH_ASSOC)["COUNT(*)"];

        $sql = "SELECT COUNT(*) FROM orders INNER JOIN order_status ON orders.status_code = order_status.id WHERE order_status.name = 'pending'";
        $stmt = $this->conn->prepare($sql);
        $stmt->execute();
        $stats["pending_count"] = $stmt->fetch(PDO::FETCH_ASSOC)["COUNT(*)"];

        return $stats;
    }
}
