<?php

namespace Controller;

class HttpResponse {
    public static function OK($message) {
        self::respond(200, $message);
    }

    public static function CREATED($message) {
        self::respond(201, $message);
    }

    public static function BAD_REQUEST($message) {
        self::respond(400, $message);
    }

    public static function NOT_FOUND($message) {
        self::respond(404, $message);
    }

    public static function UNAUTHORIZED($message) {
        self::respond(401, $message);
    }

    public static function SERVER_ERROR($message) {
        self::respond(500, $message);
    }

    public static function FORBIDDEN($message) {
        self::respond(403, $message);
    }
    
    private static function respond($statusCode, $message) {
        header("HTTP/1.1 $statusCode");

        $response = [
            'status' => $statusCode,
            'message' => $message
        ];

        echo json_encode($response);
    }
}
