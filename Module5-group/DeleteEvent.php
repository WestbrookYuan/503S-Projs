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

    $event_id = $_POST['event_id'];
    $res = deleteEvent($event_id, $_SESSION['username']);
    echo json_encode($res);
?>