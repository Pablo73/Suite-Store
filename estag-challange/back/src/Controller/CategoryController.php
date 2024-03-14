<?php
namespace Controller;
use Exception;

use Security\SecurityToken;

class CategoryController {
    private $categoryService;

    public function __construct($myPDO) {
        $this->categoryService = new \Service\CategoryService($myPDO);
    }

    public function postInserirCategoria() {
        try {
            $token = $_SERVER['HTTP_AUTHORIZATION'];
    
            if (!SecurityToken::validateToken($token)) {
                \Util\HttpResponse::UNAUTHORIZED("Invalid or expired token");
                return;
            }

            $tokenData = SecurityToken::decodeToken($token);

            $role = $tokenData['role'];
    
            $jsonData = file_get_contents("php://input");
            $data = json_decode($jsonData, true);
        
            if (isset($data['name']) && isset($data['tax'])) {
                $name = $data['name'];
                $tax = $data['tax'];
    
                $trimmedStr = trim($name);
        
                if (!is_numeric($tax) || empty($trimmedStr)) {
                    \Util\HttpResponse::BAD_REQUEST("Fill in the correct values.");
                    return;
                }
    
                if ($role === 'admin') {
                    $result = $this->categoryService->inserirCategoriaService($name, $tax);
                    
                    if ($result) {
                        \Util\HttpResponse::CREATED($result);
                    } else {
                        \Util\HttpResponse::BAD_REQUEST("Failed to register the category");
                    }
                } else {
                    \Util\HttpResponse::FORBIDDEN("User does not have the required role");
                }
            } else {
                \Util\HttpResponse::BAD_REQUEST("Missing or invalid data in the request body.");
            }
        } catch (Exception $e) {
            \Util\HttpResponse::SERVER_ERROR($e->getMessage());
        }
    }
    
    
    public function deleteCategory() {
        try {

            $token = $_SERVER['HTTP_AUTHORIZATION'];

            if (!SecurityToken::validateToken($token)) {
                \Util\HttpResponse::UNAUTHORIZED("Invalid or expired token");
                return;
            }

            $tokenData = SecurityToken::decodeToken($token);

            $role = $tokenData['role'];

            $jsonData = file_get_contents("php://input");
            $data = json_decode($jsonData, true);

            if (isset($data['name'])) {

                $name = $data['name'];

                if ($role === 'admin') {
                    
                    $result = $this->categoryService->deleteCategory($name);

                } else {
                    \Util\HttpResponse::FORBIDDEN("User does not have the required role");
                }
            }
            if ($result) {
                \Util\HttpResponse::OK($result);
            } else {
                \Util\HttpResponse::NOT_FOUND("Category not found or deletion failed");
            }
        } catch (Exception $e) {
            \Util\HttpResponse::SERVER_ERROR($e->getMessage());
        }
    }

    public function getAllCategory(): void{
        try {
            
            $result = $this->categoryService->getAllCategory();
             
            \Util\HttpResponse::OK($result);

        } catch (Exception $e) {
            \Util\HttpResponse::SERVER_ERROR($e->getMessage());
        }
    }
}
