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
    $user = $_POST['user'];
    $title = $_POST['title'];
    $date = $_POST['date'];
    $time = $_POST['time'];
    $category = $_POST['category'];
    $group = $_POST['group'];
    $res = addGroupEvent($user, $title, $date, $time, $group, $category);
    echo json_encode($res);
?>