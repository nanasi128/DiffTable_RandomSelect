<?php
    require_once("dataget.php");
    $data = data_get($_GET['url']);
    header("Access-Control-Allow-Origin: *");
    print $data;
?>