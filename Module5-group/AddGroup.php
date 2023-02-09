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
    
    $groupName = $_POST['groupName'];
    $groupList = $_POST['groupList'];
    $res = addGroup($groupName, $groupList);
    echo json_encode($res);
?>