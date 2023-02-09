<?php
    require "helpers.php";
    ini_set("session.cookie_httponly", 1);
    session_start();
    // login state check
    if(!$_SESSION['username'])
    {
        echo json_encode(array(
            "successs" => false,
            "messsage" => "You are not login!"
        ));
        exit;
    }
    
    // CSRF check
    if(!hash_equals($_SESSION['token'], $_POST['token'])){
        die("Request forgery detected");
    }

    $newUser = $_POST["newUser"]; 
    $newTitle = $_POST["newTitle"]; 
    $newDate = $_POST["newDate"]; 
    $newTime = $_POST["newTime"]; 
    $newCategory = $_POST["newCategory"];
    $res = shareEvent($newUser, $newTitle, $newDate, $newTime, $newCategory);
    echo json_encode($res);
?>