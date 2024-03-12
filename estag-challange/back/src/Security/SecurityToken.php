<?php

namespace Security;

function decodeToken($token) {
    $decodedData = base64_decode($token, true);

    if ($decodedData === false) {
        return null;
    }

    $decodedToken = json_decode($decodedData, true);

    if (json_last_error() != JSON_ERROR_NONE) {
        return null;
    }

    return $decodedToken;
}


function validateToken($token) {
    $decodedToken = decodeToken($token);

    if ($decodedToken === null) {
        return false;
    }

    $expirationDate = new \DateTime($decodedToken['expiration']);

    $currentDate = new \DateTime();

    if ($expirationDate < $currentDate) {
        return false;
    }

    return true;
}

