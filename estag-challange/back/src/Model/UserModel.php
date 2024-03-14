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

    public function updateUser($userId, $userName, $role, $password) {

        $hashedPassword = password_hash($password, PASSWORD_BCRYPT);

        $query = "UPDATE PERSON SET PASSWORD_USER_HASH = :newPassword, NAME_USER = :userName, ROLE_USER = :newRole WHERE ID = :userId;";

        $stmt = $this->myPDO->prepare($query);
        $stmt->bindValue(':userId', $userId);
        $stmt->bindValue(':userName', $userName);
        $stmt->bindValue(':newPassword', $hashedPassword);
        $stmt->bindValue(':newRole', $role);
        $success = $stmt->execute();

        return $success;
    }

    public function getIdUser($userId) {
        $query = "SELECT * FROM PERSON WHERE ID = :userId;";
        $stmt = $this->myPDO->prepare($query);
        $stmt->bindValue(':userId', $userId);
        $stmt->execute();  

        $result = $stmt->fetch(\PDO::FETCH_ASSOC); 
        return $result;
    }

    public function getAllUser(): array {
        $statement = $this->myPDO->query("SELECT ID, NAME_USER, ROLE_USER FROM PERSON WHERE NAME_USER <> 'admin' ORDER BY NAME_USER;");

        return $statement->fetchAll(\PDO::FETCH_ASSOC);
    }
}
