<?php
class UsersGateway
{
    public function __construct(Database $database)
    {
        $this->conn = $database->getConnection();
    }

    public function create(array $data): string
    {
        $sql = "INSERT INTO users (username, password, privilege, tel, email, fname, lname) VALUES (:username, :password, :privilege, :tel, :email, :fname, :lname)";
        $stmt = $this->conn->prepare($sql);

        $hashedPassword = password_hash($data["password"], PASSWORD_DEFAULT);

        $stmt->execute([
            "username" => $data["username"],
            "password" => $hashedPassword,
            "privilege" => $data["privilege"],
            "tel" => $data["tel"],
            "email" => $data["email"],
            "fname" => $data["fname"],
            "lname" => $data["lname"],
        ]);

        return $this->conn->lastInsertId();
    }

    public function get(string $id): array
    {
        $sql = "SELECT id, username, privilege, tel, email, fname, lname FROM users WHERE id = :id";
        $stmt = $this->conn->prepare($sql);

        $stmt->bindValue(":id", $id, PDO::PARAM_INT);
        $stmt->execute();

        $data = $stmt->fetch(PDO::FETCH_ASSOC);
        return $data;
    }

    public function update(array $data)
    {
        $sql = "UPDATE users SET username = :username, privilege = :privilege, tel = :tel,
         email = :email, fname = :fname, lname = :lname WHERE id = :id";

        $stmt = $this->conn->prepare($sql);

        $stmt->execute([
            "username" => $data["username"],
            "privilege" => $data["privilege"],
            "tel" => $data["tel"],
            "email" => $data["email"],
            "fname" => $data["fname"],
            "lname" => $data["lname"],
            "id" => $data["id"],
        ]);
    }

    public function delete(string $id)
    {
        $sql = "DELETE FROM users WHERE id = :id";
        $stmt = $this->conn->prepare($sql);

        $stmt->execute([
            "id" => $id
        ]);
    }

    public function getAll(): array
    {
        $sql = "SELECT * from users";
        $stmt = $this->conn->query($sql);

        $data = [];
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $data[] = $row;
        }

        return $data;
    }

    public function getRoles(): array
    {
        $sql = "SELECT * from roles ORDER BY role";
        $stmt = $this->conn->query($sql);

        $data = [];
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $data[] = $row;
        }

        return $data;
    }

    public function updateRole(array $data)
    {
        $availablePermissions = ["create_articles", "edit_articles", "post_articles", "edit_prices", "create_pricelist_item", "create_news", "edit_news", "post_news"];

        if (in_array($data['action'], $availablePermissions)) {
            $sql = "UPDATE roles SET " . $data['action'] . " = :permission WHERE role = :role";

            $stmt = $this->conn->prepare($sql);
            $stmt->execute([
                'permission' => $data['permission'],
                'role' => $data['role']
            ]);
            return "updated";
        }

        return "dismiss";
    }

    public function checkUser(array $data): string
    {
        $stmt = $this->conn->prepare('SELECT * FROM users WHERE username = :username LIMIT 1');
        $stmt->execute([
            'username' => $data["username"]
        ]);
        $user = @$stmt->fetchAll()[0];

        if ($user != null && password_verify($data["password"], $user['password'])) {
            return true;
        }

        return false;
    }

    public function changePassword(array $data)
    {
        $hashedPassword = password_hash($data["password"], PASSWORD_DEFAULT);
        $sql = "UPDATE users SET password = :password WHERE id = :id";

        $stmt = $this->conn->prepare($sql);
        $stmt->execute([
            'password' => $hashedPassword,
            'id' => $data['id']
        ]);
    }

    public function checkNameAvailability($name)
    {
        $sql = "SELECT COUNT(1) FROM users WHERE username = :name";
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
