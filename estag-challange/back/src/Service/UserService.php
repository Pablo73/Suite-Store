<?php

namespace Service;

use Model\UserModel;

class UserService { 

    private $userModel;

    public function __construct(UserModel $userModel) {
        $this->userModel = $userModel;
    }

    public function inserirUser($name, $password, $role) {
        return $this->userModel->inserirUser($name, $password, $role);
    }
    
    public function getAllUser() {
        return $this->userModel->getAllUser();
    }

    public function deleteUser($name) {
        return $this->userModel->deleteUser($name);
    }

    public function updateUser($userId, $userName, $role, $password) {
        return $this->userModel->updateUser($userId, $userName, $role, $password);
    }

    public function getIdUser($userId) {
        return $this->userModel->getIdUser($userId);
    }

}