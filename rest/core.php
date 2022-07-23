<?php
    function JSON($arr = array()){
        return @json_encode($arr, 128);
    }

    function apiError($msg){
        if(!isset($_GET['action'])){
            echo JSON(array(
                'error' => true,
                'reason' => $msg
            ));
        }
    }

    function camelcase($str, $delimeter = "_"){
        return str_replace($delimeter, "", ucwords($str, $delimeter));
    }
?>