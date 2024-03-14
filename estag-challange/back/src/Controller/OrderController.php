<?php

namespace Controller;
use Exception;

use Service\OrderService;
use Security\SecurityToken;
use Util\HttpResponse;

class OrderController {
    private $orderService;

    public function __construct(OrderService $orderService ) {
        $this->orderService = $orderService;
    }

    public function postInserirOrder() {
        try {
            
            $token = $_SERVER['HTTP_AUTHORIZATION'];

            if (!SecurityToken::validateToken($token)) {
                HttpResponse::UNAUTHORIZED("Invalid or expired token");
                return;
            }

            $jsonData = file_get_contents("php://input");
            $data = json_decode($jsonData, true);
        
            if (isset($data['totalPrice']) && isset($data['totalTax'])) {
                $totalPrice = $data['totalPrice'];
                $totalTax = $data['totalTax'];
        
                if (!is_numeric($totalPrice) && !is_numeric($totalTax) ) {
                    HttpResponse::BAD_REQUEST("Fill in the correct values.");
                    return;
                }
        
                $result = $this->orderService->inserirOrder($totalPrice, $totalTax);
        
                if ($result) {
                    HttpResponse::CREATED($result);
                } else {
                    HttpResponse::BAD_REQUEST("Failed to register the order");
                }
            } else {
                HttpResponse::BAD_REQUEST("Missing or invalid data in the request body.");
            }
        } catch (Exception $e) {
            HttpResponse::SERVER_ERROR($e->getMessage());
        }
    }

    public function postInserirOrderItem() {
        try {
            
            $token = $_SERVER['HTTP_AUTHORIZATION'];

            if (!SecurityToken::validateToken($token)) {
                HttpResponse::UNAUTHORIZED("Invalid or expired token");
                return;
            }

            $tokenData = SecurityToken::decodeToken($token);

            $loggedInUser = $tokenData['user_id'];

            $jsonData = file_get_contents("php://input");
            $data = json_decode($jsonData, true);
        
            if (isset($data['objectPurchase']) && isset($data['orderId'])) {
                $objectPurchase = $data['objectPurchase'];
                $orderId = $data['orderId'];
        
                if (empty($objectPurchase) || !is_numeric($orderId) || empty($loggedInUser)) {
                    HttpResponse::BAD_REQUEST("Fill in the correct values.");
                    return;
                }
        
                $result = $this->orderService->inserirOrderItem($objectPurchase, $orderId, $loggedInUser);
        
                if ($result) {
                    HttpResponse::CREATED("Item of order registered successfully");
                } else {
                    HttpResponse::BAD_REQUEST("Failed to register the Item of order");
                }
            } else {
                HttpResponse::BAD_REQUEST("Missing or invalid data in the request body.");
            }
        } catch (Exception $e) {
            HttpResponse::SERVER_ERROR($e->getMessage());
        }
    }

    public function getAllOrder(): void{
        try {
            
            $token = $_SERVER['HTTP_AUTHORIZATION'];

            if (!SecurityToken::validateToken($token)) {
                HttpResponse::UNAUTHORIZED("Invalid or expired token");
                return;
            }

            $tokenData = SecurityToken::decodeToken($token);

            $loggedInUser = $tokenData['user_id'];
            
            if (!empty($loggedInUser)) {


                $result = $this->orderService->getAllOrder($loggedInUser);
        
                if ($result) {
                    HttpResponse::OK($result);
                }
            }
        } catch (Exception $e) {
            HttpResponse::SERVER_ERROR($e->getMessage());
        }
    }

    public function getAllOrderItem(): void{
        try {
            
            $token = $_SERVER['HTTP_AUTHORIZATION'];

            if (!SecurityToken::validateToken($token)) {
                HttpResponse::UNAUTHORIZED("Invalid or expired token");
                return;
            }

            $tokenData = SecurityToken::decodeToken($token);

            $loggedInUser = $tokenData['user_id'];

            $jsonData = file_get_contents("php://input");
            $data = json_decode($jsonData, true);
            
            if (empty($loggedInUser) || isset($data['orderId'])) {

                $orderId = $data['orderId'];

                $result = $this->orderService->getAllOrderItem($loggedInUser, $orderId);
        
                if ($result) {
                    HttpResponse::OK($result);
                }
            }
        } catch (Exception $e) {
            HttpResponse::SERVER_ERROR($e->getMessage());
        }
    }
}