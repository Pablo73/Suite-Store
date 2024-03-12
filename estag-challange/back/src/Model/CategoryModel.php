<?php

namespace Model;

class CategoryModel {
    private $myPDO;

    public function __construct(\PDO $myPDO) {
        $this->myPDO = $myPDO;
    }

    public function inserirCategoria(string $name, float $tax): array {
        $query = "INSERT INTO CATEGORIES (CATEGORIES_NAME, TAX) VALUES (:nome, :taxa)";

        $stmt = $this->myPDO->prepare($query);

        $stmt->bindValue(':nome', $name);
        $stmt->bindValue(':taxa', $tax);

        $success = $stmt->execute();

        if ($success) {
            $allCategories = $this->getAllCategory();
    
            return ['categories' => $allCategories];
        } else {
            return ['error' => 'Failed to delete category'];
        }
    }

    public function deleteCategory(string $name): array {
        $query = "DELETE FROM CATEGORIES WHERE CATEGORIES_NAME = :name";

        $stmt = $this->myPDO->prepare($query);
        $stmt->bindParam(':name', $name);

        $success = $stmt->execute();

        if ($success) {
            $allCategories = $this->getAllCategory();
    
            return ['categories' => $allCategories];
        } else {
            return ['error' => 'Failed to delete category'];
        }
    }

    public function getAllCategory(): array {
        $statement = $this->myPDO->query("SELECT * FROM CATEGORIES ORDER BY CATEGORIES_NAME;");

        return $statement->fetchAll(\PDO::FETCH_ASSOC);
    }

    public function getIDCategory(string $categoryName): int{
        $query = "SELECT ID FROM CATEGORIES WHERE CATEGORIES_NAME = :nome";
        $stmt = $this->myPDO->prepare($query);
        $stmt->bindParam(':nome', $categoryName);
        $stmt->execute();
    
       $result = $stmt->fetch(\PDO::FETCH_ASSOC);

       return $result['id'];
    }
}
