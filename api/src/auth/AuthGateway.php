<?php
require('./jwt/src/BeforeValidException.php');
require './jwt/src/ExpiredException.php';
require './jwt/src/SignatureInvalidException.php';
require './jwt/src/JWT.php';
require './jwt/src/Key.php';
require './jwt/src/JWK.php';

use \Firebase\JWT\JWT;
use \Firebase\JWT\Key;

class AuthGateway
{
    private $key = 'smart-adminer-private-key';

    public function __construct(Database $database)
    {
        $this->conn = $database->getConnection();
        $this->usersApi = new UsersGateway($database);
    }

    /**
     * * Sign in user and set server cookie refresh token if given credentials were valid
     * @return array(Token, username, privilege, id) | false
     */
    public function login(array $data)
    {
        $stmt = $this->conn->prepare('SELECT * FROM users WHERE username = :username LIMIT 1');
        $stmt->execute([
            'username' => $data["username"]
        ]);
        $user = @$stmt->fetchAll()[0];

        if ($user != null && password_verify($data["password"], $user['password'])) {
            $iat = time();
            $exp = $iat + 60 * 15;
            $payload = array(
                'iss' => 'http://localhost:4300/api',
                'aud' => 'http://localhost:3000/',
                'iat' => $iat,
                'exp' => $exp,
                'user_id' => $user["id"],
                'user' => $user["username"],
                'role_id' => $user["role_id"]
            );
            $jwt = JWT::encode($payload, $this->key, 'HS512');
            // $decoded = JWT::decode($jwt, new Key($this->key, 'HS512'));

            $jwt_refresh = JWT::encode(array('iat' => $iat, 'exp' => $iat + 60 * 60, 'user_id' => $user["id"], 'user' => $user["username"], 'role_id' => $user["role_id"]), $this->key, 'HS512');
            setcookie("refresh_token", $jwt_refresh, time() + 3600, '/', "", false, true);

            $permissions = $this->usersApi->getRolePermissions($user["role_id"]);

            return array("token" => $jwt, "username" => $user["username"], "role" => $user["role_id"], "id" => $user["id"], "permissions" => $permissions);
        }

        return false;
    }

    /** 
     * * Issues new access token if refresh token is valid
     * @return array(Token, username, role, id) | false
     */
    public function refresh()
    {
        if (!isset($_COOKIE["refresh_token"])) {
            return false;
        }
        $refresh_token = $_COOKIE["refresh_token"];
        $current_time = time();
        try {
            $decoded = JWT::decode($refresh_token, new Key($this->key, 'HS512'));
        } catch (Exception $e) {
            return false;
        }

        $payload = array(
            'iss' => 'http://localhost:4300/api',
            'aud' => 'http://localhost:3000/',
            'iat' => $current_time,
            'exp' => $current_time + 60 * 15,
            'user_id' => $decoded->user_id,
            'user' => $decoded->user,
            'role_id' => $decoded->role_id
        );

        $permissions = $this->usersApi->getRolePermissions($decoded->role_id);

        return array("token" => JWT::encode($payload, $this->key, 'HS512'), "username" => $decoded->user, "role" => $decoded->role_id, "id" => $decoded->user_id, "permissions" => $permissions);
    }

    /**
     * * Checks if user has rights for requested action
     * @return string token | false
     */
    public function authAction(string $token, $class)
    {
        try {
            $decoded = JWT::decode($token, new Key($this->key, 'HS512'));
            $permissions = $this->getRolePermission($decoded->role_id, $class);
            return [
                'id' => $decoded->user_id,
                'token' => $token,
                'permissions' => $permissions
            ];
        } catch (Exception $e) {
            $response = $this->refresh();
            if (!$response) {
                return false;
            }
            $permissions = $this->getRolePermission($response["role"], $class);
            return [
                'id' => $response["id"],
                'token' => $response["token"],
                'permissions' => $permissions
            ];
        }
        return false;
    }

    /**
     * * Gets permissions of given role within called class
     */
    private function getRolePermission($role_id, $class)
    {
        $sql = "SELECT * FROM role_permission WHERE role_id = :role_id AND class = :class LIMIT 1";
        $stmt = $this->conn->prepare($sql);
        $stmt->execute([
            'role_id' => $role_id,
            'class' => $class
        ]);

        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function decodeToken(string $token)
    {
        try {
            $decoded_token = JWT::decode($token, new Key($this->key, 'HS512'));
            return $decoded_token->user_id;
        } catch (Exception $e) {
            return null;
        }
    }
}
