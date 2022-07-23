<?php
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Headers: *");
    header("Content-Type: application/json");
    require(__DIR__ . "/core.php");
    require(__DIR__ . "/rest.php");

    if(!isset($_GET['action'])){
        apiError("No method specified");
    }

    if(in_array($_GET['action'], $allowed_methods)){
        apiError("That method is not specified");
    }

    if(!isset($_GET['type'], $allowed_methods)){
        apiError("Either action is missing or its not allowed");
    }

    $action = $_GET['action'];
    $type = $_GET['type'];

    try{
        call_user_func(camelcase($action . '::' . camelcase($type)));

    }catch(Exception $e){
        apiError("Method dont exist!");
    }
    ?>