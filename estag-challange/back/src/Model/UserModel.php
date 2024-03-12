<?php

namespace Model;

class UserModel {
    private $myPDO;

    public function __construct(\PDO $myPDO) {
        $this->myPDO = $myPDO;
    }

    public function inserirUser($name, $password, $role) {

        $hashedPassword = password_hash($password, PASSWORD_BCRYPT);

        $query = 
        "INSERT INTO PERSON (NAME_USER, PASSWORD_USER_HASH, ROLE_USER) VALUES (:nameUser, :hashedPassword, :roleUser)";

        $stmt = $this->myPDO->prepare($query);

        $stmt->bindValue(':nameUser', $name);
        $stmt->bindValue(':hashedPassword', $hashedPassword);
        $stmt->bindValue(':roleUser', $role);

        return $stmt->execute();
    }

    public function deleteUser($name) {
        $query = "DELETE FROM PERSON WHERE NAME_USER = :nameUser";

        $stmt = $this->myPDO->prepare($query);
        $stmt->bindValue(':nameUser', $name);

        return $stmt->execute();
    }

    public function authenticateUser($name, $password) {
        $query = "SELECT ID, PASSWORD_USER_HASH, NAME_USER, ROLE_USER FROM PERSON WHERE NAME_USER = :name";
        $stmt = $this->myPDO->prepare($query);
        $stmt->bindValue(':name', $name);
        $stmt->execute();
        
        $user = $stmt->fetch(\PDO::FETCH_ASSOC);

        if ($user) {
            $passwordHash = isset($user['password_user_hash']) ? $user['password_user_hash'] : null;
    
            if ($passwordHash !== null && password_verify($password, $passwordHash)) {
                
                $token = $this->generateToken($user['id'], $user['name_user'], $user['role_user']);
                return $token;
            } else {
                error_log("Incorrect password for user: $name");
            }
        } else {
            error_log("User not found: $name");
        }
    }
    
    private function generateToken($userId, $name, $role) {

        $expiration = new \DateTime();
        $expiration->add(new \DateInterval('PT10M'));
    
        $tokenData = array(
            'user_id' => $userId,
            'username' => $name,
            'role' => $role,
            'expiration' => $expiration->format('Y-m-d H:i:s')
        );
    
        $jsonData = json_encode($tokenData);
    
        $token = base64_encode($jsonData);
    
        $this->saveTokenToDatabase($userId, $token);
        return $token;
    }
    

    private function saveTokenToDatabase($userId, $token) {
 
        $query = "INSERT INTO AUTH_TOKENS (USER_ID, TOKEN) VALUES (:userId, :token)";
        $stmt = $this->myPDO->prepare($query);
        $stmt->bindValue(':userId', $userId);
        $stmt->bindValue(':token', $token);
        $stmt->execute();
    }

    public function getAllUser(): array {
        $statement = $this->myPDO->query("SELECT ID, NAME_USER, ROLE_USER FROM PERSON WHERE NAME_USER <> 'admin' ORDER BY NAME_USER;");

        return $statement->fetchAll(\PDO::FETCH_ASSOC);
    }
}
