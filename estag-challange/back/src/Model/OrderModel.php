<?php

namespace Model;

require_once __DIR__ . '/../Model/ProductsModel.php';


class OrderModel {
    private $myPDO;
    private $productsModel;

    public function __construct(\PDO $myPDO) {
        $this->myPDO = $myPDO;
        $this->productsModel = new ProductModel($myPDO);
    }

    public function inserirOrder(float $totalPrice, float $totalTax) {

         $query = 
         "INSERT INTO ORDERS (TOTAL_ORDER, TAX_ORDER) VALUES (:totalPrice, :totalTax)";
 
         $stmt = $this->myPDO->prepare($query);
 
         $stmt->bindValue(':totalPrice', $totalPrice);
         $stmt->bindValue(':totalTax', $totalTax);

         $success = $stmt->execute();

         $lastInsertedId = $this->myPDO->lastInsertId();

        return ['success' => $success, 'lastInsertedId' => $lastInsertedId];
     }
     public function inserirOrderItem($objectPurchase, int $orderId, int $userId) {
        $results = [];
    
        foreach ($objectPurchase as $purchase) {
            if (is_array($purchase) && isset($purchase['nameProduct'])) {
                $idProduct = $this->productsModel->getIDProduct($purchase['nameProduct']);
    
                $query = "INSERT INTO ORDER_ITEM (ORDER_ITEM_AMOUNT, ORDER_ID, PRODUCT_ID, PERSON_ID) VALUES (:amount, :orderId, :productId, :userId)";
    
                $stmt = $this->myPDO->prepare($query);
    
                $stmt->bindValue(':amount', $purchase['amount']);
                $stmt->bindValue(':orderId', $orderId);
                $stmt->bindValue(':productId', $idProduct);
                $stmt->bindValue(':userId', $userId);
    
                $result = $stmt->execute();
                $results[] = $result;
            } else {
                $results[] = false;
            }
        }
    
        return $results;
    }

    public function getAllOrder($userId) {
        $queryGeneral = "SELECT
            o.ID AS order_id,
            u.ID AS user_id,
            u.NAME_USER,
            o.TOTAL_ORDER,
            o.TAX_ORDER,
            o.ORDER_DATE
        FROM
            ORDERS o
        JOIN
            ORDER_ITEM oi ON oi.ORDER_ID = o.ID
        JOIN
            PRODUCTS p ON oi.PRODUCT_ID = p.ID
        JOIN
            CATEGORIES c ON p.CATEGORIES_ID = c.ID
        JOIN
            PERSON u ON oi.PERSON_ID = u.ID
        WHERE
            u.ID = :user_id
        GROUP BY
            o.ID, u.ID, u.NAME_USER, o.TOTAL_ORDER, o.TAX_ORDER;";

        $stmt = $this->myPDO->prepare($queryGeneral);
        $stmt->bindParam(':user_id', $userId);
        $stmt->execute();

       return $stmt->fetchAll(\PDO::FETCH_ASSOC);
    }

    public function getAllOrderItem(int $userId, int $orderId) {

        $queryAllOrderItems = "SELECT
            oi.ORDER_ID AS order_id,
            oi.ORDER_ITEM_AMOUNT,
            p.PRODUCTS_NAME AS product_name,
            p.UNIT_PRICE AS unit_price,
            p.PRODUCT_AMOUNT AS available_quantity,
            c.CATEGORIES_NAME AS category_name,
            c.TAX AS tax,
            u.ID AS user_id,
            u.NAME_USER
        FROM
            ORDER_ITEM oi
        JOIN
            PRODUCTS p ON oi.PRODUCT_ID = p.ID
        JOIN
            CATEGORIES c ON p.CATEGORIES_ID = c.ID
        JOIN
            PERSON u ON oi.PERSON_ID = u.ID
        WHERE
            u.ID = :user_id AND oi.ORDER_ID = :order_id";

        $stmt = $this->myPDO->prepare($queryAllOrderItems);
        $stmt->bindParam(':user_id', $userId);
        $stmt->bindParam(':order_id', $orderId);
        $stmt->execute();

       return $stmt->fetchAll(\PDO::FETCH_ASSOC);
    }
}

