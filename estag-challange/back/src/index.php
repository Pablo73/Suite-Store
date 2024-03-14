<?php

require __DIR__ . '/vendor/autoload.php';

error_log('Sou um log,URI: $uri, Method: $method');

include('config.php');
use Controller\CategoryController;
use Service\CategoryService;
use Model\CategoryModel;
use Controller\OrderController;
use Controller\ProductController;
use Controller\UserController;
use Service\OrderService;
use Model\OrderModel;
use Model\ProductModel;
use Model\UserModel;
use Service\ProductService;
use Service\UserService;

try {
    $myPDO = new PDO("pgsql:host=" . DB_HOST . ";dbname=" . DB_NAME, DB_USER, DB_PASSWORD);
    $myPDO->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $categoryModel = new CategoryModel($myPDO);
    $categoryService = new CategoryService($categoryModel);
    $categoryController = new CategoryController($categoryService);
    
    $productModel = new ProductModel($myPDO);
    $productService = new ProductService($productModel);
    $productController = new ProductController($productService);

    $orderModel = new OrderModel($myPDO);
    $orderService = new OrderService($orderModel, $productService);
    $orderController = new OrderController($orderService);

    $userModel = new UserModel($myPDO);
    $userService = new UserService($userModel);
    $userController = new UserController($userService);    

} catch (PDOException $e) {
    echo "Database connection error.";
    exit;
}

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, DELETE, PUT");
header("Access-Control-Allow-Headers: Authorization, Content-Type");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

$uri = $_SERVER['REQUEST_URI'];
$method = $_SERVER['REQUEST_METHOD'];

$routes = [
    '/category/insert' => ['controller' => '\Controller\CategoryController', 'action' => 'postInserirCategoria'],
    '/category/delete' => ['controller' => '\Controller\CategoryController', 'action' => 'deleteCategory'],
    '/category/allCategory' => ['controller' => '\Controller\CategoryController', 'action' => 'getAllCategory'],
    '/product/insert' => ['controller' => '\Controller\ProductController', 'action' => 'postInserirProduct'],
    '/product/delete' => ['controller' => '\Controller\ProductController', 'action' => 'deleteProduct'],
    '/product/allProduct' => ['controller' => '\Controller\ProductController', 'action' => 'getAllProduct'],
    '/order/total' => ['controller' => '\Controller\OrderController', 'action' => 'postInserirOrder'],
    '/order/item' => ['controller' => '\Controller\OrderController', 'action' => 'postInserirOrderItem'],
    '/order/allOrder' => ['controller' => '\Controller\OrderController', 'action' => 'getAllOrder'],
    '/order/allOrderItem' => ['controller' => '\Controller\OrderController', 'action' => 'getAllOrderItem'],
    '/user/insert' => ['controller' => '\Controller\UserController', 'action' => 'inserirUser'],
    '/user/delete' => ['controller' => '\Controller\UserController', 'action' => 'deleteUser'],
    '/user/login' => ['controller' => '\Controller\UserController', 'action' => 'loginUser'],
    '/user/role' => ['controller' => '\Controller\UserController', 'action' => 'checkRole'],
    '/user' => ['controller' => '\Controller\UserController', 'action' => 'getAllUser'],
    '/user/update' => ['controller' => '\Controller\UserController', 'action' => 'updateUser'],
    '/user/id' => ['controller' => '\Controller\UserController', 'action' => 'getIdUser'],
];

if (in_array($method, ['GET', 'POST', 'DELETE', 'PUT'])) {
    if (array_key_exists($uri, $routes)) {
        $controllerClass = $routes[$uri]['controller'];
        $action = $routes[$uri]['action'];
    
        if (class_exists($controllerClass)) {
            switch ($controllerClass) {
                case '\Controller\CategoryController':
                    $controller = new $controllerClass($categoryService);
                    break;
                case '\Controller\ProductController':
                    $controller = new $controllerClass($productService);
                    break;
                case '\Controller\OrderController':
                    $controller = new $controllerClass($orderService);
                    break;
                case '\Controller\UserController':
                    $controller = new $controllerClass($userService);
                    break;
                default:
                    echo 'Invalid controller';
                    exit;
            }
    
            if (method_exists($controller, $action)) {
                $controller->$action();
            } else {
                echo 'Action not found in controller';
            }
        } else {
            echo 'Controller not found';
        }
    } else {
        echo 'Route not found';
    }
} else {
    echo 'HTTP method not supported';
}
