<?php
namespace Service;
use Exception;

use Model\ProductModel;

class ProductService {
    
    private $productsModel;

    public function __construct(ProductModel $productsModel) {
        $this->productsModel =  $productsModel;
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
