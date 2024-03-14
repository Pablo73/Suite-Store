<?php

namespace Controller;
use Exception;

use Security\SecurityToken;
use Service\UserService;
use Util\HttpResponse;

class UserController { 

    private $userService;

    public function __construct(UserService $userService) {
        $this->userService = $userService;
    }

    public function inserirUser() {
        try {

            $token = $_SERVER['HTTP_AUTHORIZATION'];

            if (!SecurityToken::validateToken($token)) {

                $jsonData = file_get_contents("php://input");
                $data = json_decode($jsonData, true);
            
                if (isset($data['name']) && isset($data['password'])) {
                    $name = $data['name'];
                    $password = $data['password'];
                    
                    $removingBlanksPassword = trim($password);
                    $removingBlanksName = trim($name);
                    
                    if (empty($removingBlanksPassword) || empty($removingBlanksName)) {
                        HttpResponse::BAD_REQUEST("Fill in the correct values.");
                        return;
                    }
            
                    $result = $this->userService->inserirUser($name, $password, 'user');
            
                    if ($result) {
                        HttpResponse::CREATED("User registered successfully");
                        return;
                    } else {
                        HttpResponse::BAD_REQUEST("Failed to register the user");
                        return;
                    }
                } else {
                    HttpResponse::BAD_REQUEST("Missing or invalid data in the request body.");
                    return;
                }
            } 

            $tokenData = SecurityToken::decodeToken($token);

            $role = $tokenData['role'];

            $jsonData = file_get_contents("php://input");
            $data = json_decode($jsonData, true);
        
            if (isset($data['name']) && isset($data['password'])) {
                $name = $data['name'];
                $password = $data['password'];
                
                $removingBlanksPassword = trim($password);
                $removingBlanksName = trim($name);
                
                if (empty($removingBlanksPassword) || empty($removingBlanksName)) {
                    HttpResponse::BAD_REQUEST("Fill in the correct values.");
                    return;
                }

             if ($role === 'admin') {
                 $result = $this->userService->inserirUser($name, $password, 'admin');
         
                 if ($result) {
                    HttpResponse::CREATED("User registered successfully");
                 } else {
                    HttpResponse::BAD_REQUEST("Failed to register the user");
                 }
             } else {
                HttpResponse::FORBIDDEN("User does not have the required role");
            }
            } else {
                HttpResponse::BAD_REQUEST("Missing or invalid data in the request body.");
            }
        } catch (Exception $e) {
            HttpResponse::SERVER_ERROR($e->getMessage());
        }
    }

    public function inserirAdmin() {
        try {

            $token = $_SERVER['HTTP_AUTHORIZATION'];

            if (!SecurityToken::validateToken($token)) {
                HttpResponse::UNAUTHORIZED("Invalid or expired token");
                return;
            }

            $tokenData =SecurityToken::decodeToken($token);

            $role = $tokenData['role'];

            $jsonData = file_get_contents("php://input");
            $data = json_decode($jsonData, true);
        
            if (isset($data['name']) && isset($data['password'])) {
                $name = $data['name'];
                $password = $data['password'];
                
                $removingBlanksPassword = trim($password);
                $removingBlanksName = trim($name);
                
                if (empty($removingBlanksPassword) || empty($removingBlanksName)) {
                    HttpResponse::BAD_REQUEST("Fill in the correct values.");
                    return;
                }

                if ($role === 'admin') {

                    $result = $this->userService->inserirUser($name, $password, 'admin');
            
                    if ($result) {
                        HttpResponse::CREATED("User registered successfully");
                    } else {
                        HttpResponse::BAD_REQUEST("Failed to register the user");
                    }
                } else {
                    HttpResponse::FORBIDDEN("User does not have the required role");
                }
            } else {
                HttpResponse::BAD_REQUEST("Missing or invalid data in the request body.");
            }
        } catch (Exception $e) {
            HttpResponse::SERVER_ERROR($e->getMessage());
        }
    }

    public function deleteUser() {
        try {
            
            $token = $_SERVER['HTTP_AUTHORIZATION'];

            if (!SecurityToken::validateToken($token)) {
                HttpResponse::UNAUTHORIZED("Invalid or expired token");
                return;
            }

            $tokenData =SecurityToken::decodeToken($token);

            $loggedInUser = $tokenData['username'];

            $role = $tokenData['role'];

            if ($role === 'user' ) {
                if (!empty($loggedInUser) && is_string($loggedInUser)) {
    
                    $result = $this->userService->deleteUser($loggedInUser);
    
                    if ($result) {
                        HttpResponse::OK("User deleted successfully");
                    } else {
                        HttpResponse::BAD_REQUEST("Failed to delete the user");
                    }
                } else {
                    HttpResponse::BAD_REQUEST("Missing or invalid data.");
                }
            } else if ($role === "admin") {

                $jsonData = file_get_contents("php://input");
                $data = json_decode($jsonData, true);
        
                if (isset($data['userName'])) {
                    $userName = $data['userName'];
        
                    $result = $this->userService->deleteUser($userName);
        
                    if ($result) {
                        HttpResponse::OK($result);
                    } else {
                        HttpResponse::UNAUTHORIZED("Invalid credentials");
                    }
                }
            } else  {

               return null;

            }
       
        } catch (Exception $e) {
            HttpResponse::SERVER_ERROR($e->getMessage());
        }
    }

    public function loginUser(): void {
        try {
            $jsonData = file_get_contents("php://input");
            $data = json_decode($jsonData, true);
    
            if (isset($data['name']) && isset($data['password'])) {
                $name = $data['name'];
                $password = $data['password'];
    
                $token = $this->userService->authenticateUser($name, $password);
    
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

    
    public function getAllUser(): void{
        try {
            $result = $this->userService->getAllUser();
             
            HttpResponse::OK($result);

        } catch (Exception $e) {
            HttpResponse::SERVER_ERROR($e->getMessage());
        }
    }
    
    public function updateUser() {
        $token = $_SERVER['HTTP_AUTHORIZATION'];
    
        if (!SecurityToken::validateToken($token)) {
            HttpResponse::UNAUTHORIZED("Invalid or expired token");
            return;
        }
    
        $tokenData = SecurityToken::decodeToken($token);
        $userId = $tokenData['user_id'];
        $role = $tokenData['role'];
    
        $jsonData = file_get_contents("php://input");
        $data = json_decode($jsonData, true);
    
        if (isset($data['name']) && isset($data['password'])) {
            $userName = $data['name'];
            $password = $data['password'];
    
            $removingBlanksPassword = trim($password);
            $removingBlanksName = trim($userName);
    
            if (empty($removingBlanksPassword) || empty($removingBlanksName)) {
                HttpResponse::BAD_REQUEST("Fill in the correct values.");
                return;
            }
    
            $result = $this->userService->updateUser($userId, $userName, $role, $password);
    
            if ($result) {
                HttpResponse::OK("User updated successfully");
                return;
            } else {
                HttpResponse::BAD_REQUEST("Failed to update the user");
                return;
            }
        } else {
            HttpResponse::BAD_REQUEST("Missing or invalid data in the request body.");
            return;
        }
    }

    public function getIdUser(): void{
        try {
            $token = $_SERVER['HTTP_AUTHORIZATION'];
    
            if (!SecurityToken::validateToken($token)) {
                HttpResponse::UNAUTHORIZED("Invalid or expired token");
                return;
            }
        
            $tokenData = SecurityToken::decodeToken($token);
            $userId = $tokenData['user_id'];
            $result = $this->userService->getIdUser($userId);
             
            HttpResponse::OK($result);

        } catch (Exception $e) {
            HttpResponse::SERVER_ERROR($e->getMessage());
        }
    }
}