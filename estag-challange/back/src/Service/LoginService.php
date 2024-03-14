<?php

namespace Service;

use Model\LoginModel;

class LoginService { 

    private $loginModel;

    public function __construct(LoginModel $loginModel) {
        $this->loginModel = $loginModel;
    }
    
    public function authenticateUser($name, $password) {
        return $this->loginModel->authenticateUser($name, $password);
    }
}