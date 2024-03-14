<?php

namespace Service;

use Model\CategoryModel;

class CategoryService {

    private $categoryModel;

    public function __construct(CategoryModel $categoryModel) {
        $this->categoryModel = $categoryModel;
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


