<?php

namespace Service;

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
    
    public function getAllUser() {
        return $this->userModel->getAllUser();
    }

    public function updateUser($userId, $userName, $role, $password) {
        return $this->userModel->updateUser($userId, $userName, $role, $password);
    }

    public function getIdUser($userId) {
        return $this->userModel->getIdUser($userId);
    }

}