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
    }

    /**
     * * Sign in user and set server cookie refresh token if given credentials were valid
     * @return array(Token, username, privilege, id) | false
     */
    public function auth(array $data)
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
                'privilege' => $user["privilege"]
            );
            $jwt = JWT::encode($payload, $this->key, 'HS512');
            // $decoded = JWT::decode($jwt, new Key($this->key, 'HS512'));

            $jwt_refresh = JWT::encode(array('iat' => $iat, 'exp' => $iat + 60 * 60, 'user_id' => $user["id"], 'user' => $user["username"], 'privilege' => $user["privilege"]), $this->key, 'HS512');
            setcookie("refresh_token", $jwt_refresh, time() + 3600, '/', "", false, true);
            return array("token" => $jwt, "username" => $user["username"], "role" => $user["privilege"], "id" => $user["id"]);
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
        $currentTime = time();
        try {
            $decoded = JWT::decode($refresh_token, new Key($this->key, 'HS512'));
        } catch (Exception $e) {
            return false;
        }

        $payload = array(
            'iss' => 'http://localhost:4300/api',
            'aud' => 'http://localhost:3000/',
            'iat' => $currentTime,
            'exp' => $currentTime + 60 * 15,
            'user_id' => $decoded->user_id,
            'user' => $decoded->user,
            'privilege' => $decoded->privilege
        );

        return array("token" => JWT::encode($payload, $this->key, 'HS512'), "username" => $decoded->user, "role" => $decoded->privilege, "id" => $decoded->user_id);
    }

    /**
     * * Checks if user has rights for requested action
     * @return string token | false
     */
    public function authAction(string $token, array $allowedRoles)
    {
        $accessToken = $token;
        try {
            $decoded = JWT::decode($accessToken, new Key($this->key, 'HS512'));
            if (in_array($decoded->privilege, $allowedRoles)) {
                return $accessToken;
            }
        } catch (Exception $e) {
            $response = $this->refresh();
            if (!$response) {
                return false;
            }
            $accessToken = $response["token"];
            if (in_array($response["role"], $allowedRoles)) {
                return $accessToken;
            }
        }
        return false;
    }
}
