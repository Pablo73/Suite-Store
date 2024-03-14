<?php

namespace Service;

use Model\OrderModel;
use Service\ProductService;

class OrderService {
    private $orderModel;
    private $productService;
    public function __construct(OrderModel $orderModel, ProductService $productService) {
        $this->orderModel = $orderModel;
        $this->productService = $productService;
    }

    public function inserirOrder(float $totalPrice, float $totalTax) {
        return $this->orderModel->inserirOrder($totalPrice, $totalTax);
    }

    public function inserirOrderItem($objectPurchase, int $orderId, int $userId) {
        $result2 = $this->orderModel->inserirOrderItem($objectPurchase, $orderId, $userId);
        $result1 =  $this->productService->diminuirQuantidadesProdutos($objectPurchase);
        return $result1 && $result2;
    }

    public function getAllOrder($userId) {
        return $this->orderModel->getAllOrder($userId);
    }

    public function getAllOrderItem($userId, $orderId) {
        return $this->orderModel->getAllOrderItem($userId, $orderId);
    }
}