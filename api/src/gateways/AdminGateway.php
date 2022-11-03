<?php
require('./jwt/src/BeforeValidException.php');
require './jwt/src/ExpiredException.php';
require './jwt/src/SignatureInvalidException.php';
require './jwt/src/JWT.php';
require './jwt/src/Key.php';
require './jwt/src/JWK.php';

use \Firebase\JWT\JWT;
use \Firebase\JWT\Key;

class AdminGateway
{

    //private PDO $conn;
    private $key = 'privatekey';

    public function __construct(Database $database)
    {
        $this->conn = $database->getConnection();
    }

    public function create(array $data): string
    {
        $sql = "INSERT INTO users (username, password, privilege, tel, email, fname, lname) VALUES (:username, :password, :privilege, :tel, :email, :fname, :lname)";
        $stmt = $this->conn->prepare($sql);

        $hashedPassword = password_hash($data["password"], PASSWORD_DEFAULT);

        $stmt->bindValue(":username", $data["username"], PDO::PARAM_STR);
        $stmt->bindValue(":password", $hashedPassword, PDO::PARAM_STR);
        $stmt->bindValue(":privilege", $data["privilege"], PDO::PARAM_STR);
        $stmt->bindValue(":tel", $data["tel"], PDO::PARAM_STR);
        $stmt->bindValue(":email", $data["email"], PDO::PARAM_STR);
        $stmt->bindValue(":fname", $data["fname"], PDO::PARAM_STR);
        $stmt->bindValue(":lname", $data["lname"], PDO::PARAM_STR);

        $stmt->execute();

        return $this->conn->lastInsertId();
    }

    public function get(string $id): array
    {
        $sql = "SELECT * FROM users WHERE id = :id";
        $stmt = $this->conn->prepare($sql);

        $stmt->bindValue(":id", $id, PDO::PARAM_INT);
        $stmt->execute();

        $data = $stmt->fetch(PDO::FETCH_ASSOC);
        return $data;
    }

    public function update(array $current, array $data): int
    {
        $sql = "UPDATE users SET username = :username, privilege = :privilege, tel = :tel,
         email = :email, fname = :fname, lname = :lname WHERE id = :id";

        $stmt = $this->conn->prepare($sql);

        //$hashedPassword = password_hash($data["password"], PASSWORD_DEFAULT);

        $stmt->bindValue(":username", $data["username"] ?? $current["username"], PDO::PARAM_STR);
        //$stmt->bindValue(":password", $hashedPassword ?? $current["password"], PDO::PARAM_STR);
        $stmt->bindValue(":privilege", $data["privilege"] ?? $current["privilege"], PDO::PARAM_STR);
        $stmt->bindValue(":tel", $data["tel"] ?? $current["tel"], PDO::PARAM_STR);
        $stmt->bindValue(":email", $data["email"] ?? $current["email"], PDO::PARAM_STR);
        $stmt->bindValue(":fname", $data["fname"] ?? $current["fname"], PDO::PARAM_STR);
        $stmt->bindValue(":lname", $data["lname"] ?? $current["lname"], PDO::PARAM_STR);

        $stmt->bindValue(":id", $current["id"], PDO::PARAM_INT);

        $stmt->execute();

        return $stmt->rowCount();
    }

    public function delete(string $id): int
    {
        $sql = "DELETE FROM users WHERE id = :id";

        $stmt = $this->conn->prepare($sql);

        $stmt->bindValue(":id", $id, PDO::PARAM_INT);

        $stmt->execute();


        return $stmt->rowCount();
    }

    public function getAll(): array
    {
        $sql = "SELECT * from users";
        $stmt = $this->conn->query($sql);

        $data = [];
        // boolean values have to converted manualy, represented by 0/1 by default
        // $row["bool column"] = (bool) $row["bool column];
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $data[] = $row;
        }

        return $data;
    }

    public function getRoles(): array
    {
        $sql = "SELECT * from roles";
        $stmt = $this->conn->query($sql);

        $data = [];
        // boolean values have to converted manualy, represented by 0/1 by default
        // $row["bool column"] = (bool) $row["bool column];
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

    public function auth(array $data)
    {
        $stmt = $this->conn->prepare('SELECT * FROM users WHERE username = :username LIMIT 1');
        $stmt->execute([
            'username' => $data["username"]
        ]);
        $user = @$stmt->fetchAll()[0];

        if ($user != null && password_verify($data["password"], $user['password'])) {
            $iat = time();
            $exp = $iat + 60 * 5;
            $payload = array(
                'iss' => 'http://localhost:4300/api',
                'aud' => 'http://localhost:3000/',
                'iat' => $iat,
                'exp' => $exp,
                'user' => $user["username"],
                'privilege' => $user["privilege"]
            );
            $jwt = JWT::encode($payload, $this->key, 'HS512');
            // $decoded = JWT::decode($jwt, new Key($this->key, 'HS512'));

            $jwt_refresh = JWT::encode(array('iat' => $iat, 'exp' => $iat + 60 * 30, 'user' => $user["username"], 'privilege' => $user["privilege"]), $this->key, 'HS512');
            setcookie("refresh_token", $jwt_refresh, null, '/', null, false, true);
            return array("token" => $jwt, "username" => $user["username"], "role" => $user["privilege"], "refresh_token" => $jwt_refresh);
        }

        return "wrong";
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
        // if ($user != null && $data["password"] == $user['password']) {
        //     return true;
        // }
        return false;
    }

    public function refresh()
    {
        $refresh_token = $_COOKIE["refresh_token"];
        if (!isset($refresh_token)) {
            return false;
        }

        $decoded = JWT::decode($refresh_token, new Key($this->key, 'HS512'));
        $currentTime = time();

        if ($decoded->exp < $currentTime) {
            return false;
        }
        $payload = array(
            'iss' => 'http://localhost:4300/api',
            'aud' => 'http://localhost:3000/',
            'iat' => $currentTime,
            'exp' => $currentTime + 60 * 5,
            'user' => $decoded->user,
            'privilege' => $decoded->privilege
        );
        return JWT::encode($payload, $this->key, 'HS512');
    }

    public function createCookie()
    {

        setcookie("refresh_token", "F Me", null, '/', null, false, true);
    }
}
