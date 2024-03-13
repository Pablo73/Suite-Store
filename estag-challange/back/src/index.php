<?php

error_log('Sou um log,URI: $uri, Method: $method');

include('config.php');
require_once __DIR__ . '/Controller/CategoryController.php';
require_once __DIR__ . '/Controller/ProductController.php';
require_once __DIR__ . '/Controller/OrderController.php';
require_once __DIR__ . '/Controller/UserController.php';
require_once __DIR__ . '/Service/CategoryService.php';
require_once __DIR__ . '/Service/ProductsService.php';
require_once __DIR__ . '/Service/OrderService.php';
require_once __DIR__ . '/Service/UserService.php';
require_once __DIR__ . '/Model/CategoryModel.php';
require_once __DIR__ . '/Model/ProductsModel.php';
require_once __DIR__ . '/Model/OrderModel.php';
require_once __DIR__ . '/Model/UserModel.php';


try {
    $myPDO = new PDO("pgsql:host=" . DB_HOST . ";dbname=" . DB_NAME, DB_USER, DB_PASSWORD);
    $myPDO->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    echo "Database connection error.";
    exit;
}

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, DELETE");
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
];

if (in_array($method, ['GET', 'POST', 'DELETE', 'PUT'])) {
    if (array_key_exists($uri, $routes)) {
        $controllerClass = $routes[$uri]['controller'];
        $action = $routes[$uri]['action'];

        if (class_exists($controllerClass)) {
            $controller = new $controllerClass($myPDO);

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