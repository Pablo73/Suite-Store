<?php

namespace Model;

class ProductModel {
    private $myPDO;
    private $categoryModel;

    public function __construct(\PDO $myPDO) {
        $this->myPDO = $myPDO;
        $this->categoryModel = new \Model\CategoryModel($myPDO);
    }

    public function inserirProduct(String $name, int $amount, float $price, string $nameCategory) {

       $idCategory = $this->categoryModel->getIDCategory($nameCategory);

        $query = 
        "INSERT INTO PRODUCTS (PRODUCTS_NAME, UNIT_PRICE, PRODUCT_AMOUNT, CATEGORIES_ID) VALUES (:nome, :price, :amount, :idCategory)";

        $stmt = $this->myPDO->prepare($query);

        $stmt->bindValue(':nome', $name);
        $stmt->bindValue(':amount', $amount);
        $stmt->bindValue(':price', $price);
        $stmt->bindValue(':idCategory', $idCategory);

        $success = $stmt->execute();
        
        if ($success) {
            $allProducts = $this->getAllProduct();
    
            return ['products' => $allProducts];
        } else {
            return ['error' => 'Failed to delete product'];
        }
    }

    public function deleteProduct(string $name): array {
        $query = "DELETE FROM PRODUCTS WHERE PRODUCTS_NAME = :name";

        $stmt = $this->myPDO->prepare($query);
        $stmt->bindParam(':name', $name);

        $success = $stmt->execute();

        if ($success) {
            $allProducts = $this->getAllProduct();
    
            return ['products' => $allProducts];
        } else {
            return ['error' => 'Failed to delete product'];
        }
    }

    public function getAllProduct(): array {
        $statement = $this->myPDO->query(
            "SELECT PRODUCTS.*, CATEGORIES.*
            FROM PRODUCTS
            LEFT JOIN CATEGORIES ON PRODUCTS.CATEGORIES_ID = CATEGORIES.ID
            ORDER BY PRODUCTS.PRODUCTS_NAME;"
        );
        return $statement->fetchAll(\PDO::FETCH_ASSOC);
    }

    public function getIDProduct(string $ProductName): int{
        $query = "SELECT ID FROM PRODUCTS WHERE PRODUCTS_NAME = :nome";
        $stmt = $this->myPDO->prepare($query);
        $stmt->bindParam(':nome', $ProductName);
        $stmt->execute();
    
       $result = $stmt->fetch(\PDO::FETCH_ASSOC);

       return $result['id'];
    }

    public function diminuirQuantidadeProduto($productId, $amount) {
        $query = "UPDATE PRODUCTS SET PRODUCT_AMOUNT = PRODUCT_AMOUNT - :amount WHERE ID = :productId";
        $stmt = $this->myPDO->prepare($query);
        $stmt->bindParam(':amount', $amount);
        $stmt->bindParam(':productId', $productId);
        $stmt->execute();
    }
}