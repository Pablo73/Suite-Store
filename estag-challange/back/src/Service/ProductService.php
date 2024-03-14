<?php
namespace Service;
use Exception;

class ProductService {
    
    private $productsModel;

    public function __construct($myPDO) {
        $this->productsModel = new \Model\ProductModel($myPDO);
    }

    public function insertProduct(String $name, int $amount, float $price, string $nameCategory): array {
        return $this->productsModel->inserirProduct($name, $amount, $price, $nameCategory);
    }

    public function deleteProduct(string $name): array {
        return $this->productsModel->deleteProduct($name);
    }

    public function getAllProduct(): array {
        return $this->productsModel->getAllProduct();
    }

    public function diminuirQuantidadesProdutos($objectPurchase) {
        try {
            foreach ($objectPurchase as $purchase) {
                $productName = $purchase['nameProduct'];
                $amount = $purchase['amount'];

                $productId = $this->productsModel->getIDProduct($productName);
    
                $this->productsModel->diminuirQuantidadeProduto($productId, $amount);
            }
    
            return true;
        } catch (Exception $e) {

            return false;
        }
    }
}
