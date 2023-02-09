<?php 
    header("Content-Type: application/json");
    require 'helpers.php';
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


    $user = $_SESSION['username'];

    $json_str = file_get_contents('php://input');
    $json_obj = json_decode($json_str, true);

    $event_id = $json_obj['event_id'];
    $newTitle = $json_obj['newTitle'];
    $newDate = $json_obj['newDate'];
    $newTime = $json_obj['newTime'];
    $newCategory = $json_obj['newCategory'];
    $token = $json_obj['token'];
    
    // CSRF check
    if(!hash_equals($_SESSION['token'], $token)){
        die("Request forgery detected");
    }

    $res = editEvent($event_id, $newTitle, $newDate, $newTime, $newCategory,$user);

    if($res)
    {
        echo json_encode(array(
            "success" => true
        ));
    }else {
        echo json_encode(array(
            "success" => false,
            "message" => "failed to edit the message",
        ));
    }
?>