<?php
class Database
{
    public function __construct(string $host, string $name, string $user, string $password)
    {
        $this->host = $host;
        $this->name = $name;
        $this->user = $user;
        $this->password = $password;
    }

    public function getConnection(): PDO
    {
        $dsn = "mysql:host={$this->host};dbname={$this->name}; charset=utf8";

        try {
            $database = new PDO($dsn, $this->user, $this->password, [
                PDO::ATTR_EMULATE_PREPARES => false,
                PDO::ATTR_STRINGIFY_FETCHES => false
            ]);
            return $database;
        } catch (Exception $e) {
            echo "Database connection failed";
        }
    }
}
