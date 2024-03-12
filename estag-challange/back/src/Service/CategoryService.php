<?php

namespace Service;

require_once __DIR__ . '/../Model/CategoryModel.php';

class CategoryService {

    private $categoryModel;

    public function __construct($myPDO) {
        $this->categoryModel = new \Model\CategoryModel($myPDO);
    }

    public function inserirCategoriaService(string $name, float $tax): array {
        return $this->categoryModel->inserirCategoria($name, $tax);
    }

    public function deleteCategory(string $name): array {
        return $this->categoryModel->deleteCategory($name);
    }

    public function getAllCategory(): array {
        return $this->categoryModel->getAllCategory();
    }
}

