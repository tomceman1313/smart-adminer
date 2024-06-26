<?php
class UsersGateway
{
    public function __construct(Database $database)
    {
        $this->conn = $database->getConnection();
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

    public function get(string $id): array
    {
        $sql = "SELECT id, username, role_id, tel, email, fname, lname FROM users WHERE id = :id";
        $stmt = $this->conn->prepare($sql);

        $stmt->bindValue(":id", $id, PDO::PARAM_INT);
        $stmt->execute();

        $data = $stmt->fetch(PDO::FETCH_ASSOC);
        return $data;
    }


    public function create(array $data): string
    {
        $sql = "INSERT INTO users (username, password, role_id, tel, email, fname, lname) VALUES (:username, :password, :role_id, :tel, :email, :fname, :lname)";
        $stmt = $this->conn->prepare($sql);

        $hashedPassword = password_hash($data["password"], PASSWORD_DEFAULT);

        $stmt->execute([
            "username" => $data["username"],
            "password" => $hashedPassword,
            "role_id" => $data["role_id"],
            "tel" => $data["tel"],
            "email" => $data["email"],
            "fname" => $data["fname"],
            "lname" => $data["lname"],
        ]);

        return $this->conn->lastInsertId();
    }

    public function update(array $data, $id)
    {
        $sql = "UPDATE users SET username = :username, tel = :tel, email = :email, fname = :fname, lname = :lname";

        $sql_values = [
            "username" => $data["username"],
            "tel" => $data["tel"],
            "email" => $data["email"],
            "fname" => $data["fname"],
            "lname" => $data["lname"],
            "id" => $id,
        ];

        if (isset($data["role_id"])) {
            $sql_values["role_id"] = $data["role_id"];
            $sql .= ", role_id = :role_id";
        }

        $sql .= " WHERE id = :id";

        $stmt = $this->conn->prepare($sql);

        $stmt->execute($sql_values);
    }

    public function delete(string $id)
    {
        $sql = "DELETE FROM users WHERE id = :id";
        $stmt = $this->conn->prepare($sql);

        $stmt->execute([
            "id" => $id
        ]);
    }

    /**------------------------------------------------------------ ROLES */

    public function getRoles(): array
    {
        $sql = "SELECT * from roles ORDER BY name";
        $stmt = $this->conn->query($sql);

        $data = [];
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $data[] = $row;
        }

        return $data;
    }

    public function createRole(array $data)
    {
        $sql = "INSERT INTO roles (name) VALUES (:name)";
        $stmt = $this->conn->prepare($sql);
        $stmt->execute([
            "name" => $data["name"]
        ]);

        $role_id = $this->conn->lastInsertId();

        $sql = "SELECT DISTINCT class FROM role_permission";
        $stmt = $this->conn->query($sql);
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $sql = "INSERT INTO role_permission (role_id, class, get_permission, post_permission, put_permission, delete_permission) VALUES (:role_id, :class, 0, 0, 0, 0)";
            $stmt_permission = $this->conn->prepare($sql);
            $stmt_permission->execute([
                "role_id" => $role_id,
                "class" => $row["class"]
            ]);
        }
    }

    public function updateRole(array $data, $id)
    {
        $sql = "UPDATE roles SET name = :name WHERE id = :id";
        $stmt = $this->conn->prepare($sql);
        $stmt->execute([
            "name" => $data["name"],
            "id" => $id
        ]);
    }

    public function deleteRole($id)
    {
        $sql = "DELETE FROM roles WHERE id = :id";
        $stmt = $this->conn->prepare($sql);
        $stmt->execute([
            "id" => $id
        ]);

        $sql = "DELETE FROM role_permission WHERE role_id = :role_id";
        $stmt = $this->conn->prepare($sql);
        $stmt->execute([
            "role_id" => $id
        ]);

        $sql = "DELETE FROM users WHERE role_id = :role_id";
        $stmt = $this->conn->prepare($sql);
        $stmt->execute([
            "role_id" => $id
        ]);
    }

    /**------------------------------------------------------------------ PERMISSIONS */

    public function getPermissions(): array
    {
        $sql = "SELECT * from role_permission ORDER BY role_id, class";
        $stmt = $this->conn->query($sql);

        $data = [];
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $data[] = $row;
        }
        return $data;
    }

    public function getRolePermissions(string $id): array
    {
        $sql = "SELECT * FROM role_permission WHERE role_id = :role_id ORDER BY class";
        $stmt = $this->conn->prepare($sql);

        $stmt->execute([
            'role_id' => $id
        ]);

        $data = [];
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $data[] = $row;
        }

        return $data;
    }

    public function updatePermission(string $id, string $method)
    {
        $permission_method = $method . "_permission";
        $sql = "SELECT $permission_method FROM role_permission WHERE id = :id";
        $stmt = $this->conn->prepare($sql);

        $stmt->execute([
            'id' => $id
        ]);
        $permission = $stmt->fetch(PDO::FETCH_ASSOC);


        $sql = "UPDATE role_permission SET $permission_method = :method WHERE id = :id";
        $stmt = $this->conn->prepare($sql);

        $stmt->execute([
            "method" => $permission[$permission_method] == 1 ? 0 : 1,
            "id" => $id,
        ]);
    }

    public function createPermissions(string $class)
    {
        $roles = $this->getRoles();

        foreach ($roles as $role) {
            $sql = "INSERT INTO role_permission (role_id, class, get_permission, post_permission, put_permission, delete_permission) VALUES (:role_id, :class, 0, 0, 0, 0)";
            $stmt = $this->conn->prepare($sql);
            $stmt->execute([
                "role_id" => $role["id"],
                "class" => $class
            ]);
        }
    }

    public function changePassword(array $data, $id)
    {
        $hashedPassword = password_hash($data["password"], PASSWORD_DEFAULT);
        $sql = "UPDATE users SET password = :password WHERE id = :id";

        $stmt = $this->conn->prepare($sql);
        $stmt->execute([
            'password' => $hashedPassword,
            'id' => $id
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
