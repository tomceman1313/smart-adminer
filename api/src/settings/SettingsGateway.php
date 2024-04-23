<?php

class NotificationsGateway
{
    public function __construct(Database $database)
    {
        $this->conn = $database->getConnection();
    }

    public function createDatabaseTables()
    {
        $sql = "SHOW TABLES";
        $stmt = $this->conn->query($sql);

        $tables = $stmt->fetch(PDO::FETCH_ASSOC);

        if (count($tables) > 0) {
        }
    }
}
