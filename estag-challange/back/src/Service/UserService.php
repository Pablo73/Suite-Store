<?php

namespace Service;

require_once __DIR__ . '/../Model/UserModel.php';

class UserService { 

    private $userModel;

    public function __construct($myPDO) {
        $this->userModel = new \Model\UserModel($myPDO);
    }

    public function inserirUser($name, $password, $role) {
        return $this->userModel->inserirUser($name, $password, $role);
    }
    
    public function deleteUser($name) {
        return $this->userModel->deleteUser($name);
    }
    
    public function authenticateUser($name, $password) {
        return $this->userModel->authenticateUser($name, $password);
    }
    
    public function getAllUser(): array {
        return $this->userModel->getAllUser();
    }

}