<?php

namespace Controller;
use Exception;

use Service\ProductService;
use Security\SecurityToken;
use Util\HttpResponse;

class ProductController {
    private $productsService;

    public function __construct(ProductService $productsService) {
        $this->productsService = $productsService;
    }

    public function postInserirProduct() {
        try {
            
            $token = $_SERVER['HTTP_AUTHORIZATION'];

            if (!SecurityToken::validateToken($token)) {
                HttpResponse::UNAUTHORIZED("Invalid or expired token");
                return;
            }

            $tokenData = SecurityToken::decodeToken($token);

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
                        HttpResponse::CREATED($result);
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

            if (!SecurityToken::validateToken($token)) {
                HttpResponse::UNAUTHORIZED("Invalid or expired token");
                return;
            }

            $tokenData = SecurityToken::decodeToken($token);

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
                HttpResponse::OK($result);
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