<?php

namespace Controller;
use Exception;

use Security\SecurityToken;
use Service\LoginService;
use Util\HttpResponse;

class LoginController {

    private $loginService;

    public function __construct(LoginService $loginService) {
        $this->loginService = $loginService;
    }

    public function loginUser(): void {
        try {
            $jsonData = file_get_contents("php://input");
            $data = json_decode($jsonData, true);
    
            if (isset($data['name']) && isset($data['password'])) {
                $name = $data['name'];
                $password = $data['password'];
    
                $token = $this->loginService->authenticateUser($name, $password);
    
                if ($token) {
                    HttpResponse::OK(['token' => $token]);
                } else {
                    HttpResponse::UNAUTHORIZED("Invalid credentials");
                }
            } else {
                HttpResponse::BAD_REQUEST("Missing or invalid data in the request body.");
            }
        } catch (Exception $e) {
            HttpResponse::SERVER_ERROR($e->getMessage());
        }
    }
    
    public function checkRole(): void {
        try {   
            $token = $_SERVER['HTTP_AUTHORIZATION'];
    
            if (!SecurityToken::validateToken($token)) {
                HttpResponse::UNAUTHORIZED("Invalid or expired token");
                return;
            }
            $tokenData =SecurityToken::decodeToken($token);
    
            $role = $tokenData['role'];

            header('Content-Type: application/json');
   
            $response = [
                'role' => $role 
            ];
            HttpResponse::OK(json_encode($response));
    
        } catch (Exception $e) {
            HttpResponse::SERVER_ERROR($e->getMessage());
        }
    }

}