<?php

namespace Controller;
use Exception;

require_once __DIR__ . '/../Service/ProductsService.php';
require_once __DIR__ . '/../util/HttpResponse.php';
require_once __DIR__ . '/../Security/SecurityToken.php';

class ProductController {
    private $productsService;

    public function __construct($myPDO) {
        $this->productsService = new \Service\ProductService($myPDO);
    }

    
    public function postInserirProduct() {
        try {
            
            $token = $_SERVER['HTTP_AUTHORIZATION'];

            if (!\Security\validateToken($token)) {
                HttpResponse::UNAUTHORIZED("Invalid or expired token");
                return;
            }

            $tokenData = \Security\decodeToken($token);

            $role = $tokenData['role'];

            $jsonData = file_get_contents("php://input");
            $data = json_decode($jsonData, true);
        
            if (isset($data['name']) 
                && isset($data['amount']) 
                && isset($data['price']) 
                && isset($data['nameCategory'])
            ) {
                $name = $data['name'];
                $amount = $data['amount'];
                $price = $data['price'];
                $nameCategory = $data['nameCategory'];

                $removingBlanksName = trim($name);
                $removingBlanksCategory = trim($nameCategory);
        
                if (!is_numeric($amount) || !is_numeric($price) || empty($removingBlanksName) || empty($removingBlanksCategory)) {
                    HttpResponse::BAD_REQUEST("Fill in the correct values.");
                    return;
                }

                if ($role === 'admin') {

                    $result = $this->productsService->insertProduct($name, $amount, $price, $nameCategory);
            
                    if ($result) {
                        HttpResponse::CREATED("Product registered successfully");
                    } else {
                        HttpResponse::BAD_REQUEST("Failed to register the product");
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

    public function deleteProduct(): void{
        try {
            
            $token = $_SERVER['HTTP_AUTHORIZATION'];

            if (!\Security\validateToken($token)) {
                HttpResponse::UNAUTHORIZED("Invalid or expired token");
                return;
            }

            $tokenData = \Security\decodeToken($token);

            $role = $tokenData['role'];
    

            $jsonData = file_get_contents("php://input");
            $data = json_decode($jsonData, true);

            if (isset($data['name'])) {

                $name = $data['name'];

                if ($role === 'admin') {
                    
                    $result = $this->productsService->deleteProduct($name);

                } else {
                    HttpResponse::FORBIDDEN("User does not have the required role");
                }
            }
            if ($result) {
                HttpResponse::OK("Product deleted successfully");
            } else {
                HttpResponse::NOT_FOUND("Product not found or deletion failed");
            }
            
        } catch (Exception $e) {
            HttpResponse::SERVER_ERROR($e->getMessage());
        }
    }

    public function getAllProduct(): void{
        try {
            
            $result = $this->productsService->getAllProduct();
             
            HttpResponse::OK($result);

        } catch (Exception $e) {
            HttpResponse::SERVER_ERROR($e->getMessage());
        }
    }

}