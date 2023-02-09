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

    // get input data from front end
    $json_str = file_get_contents('php://input');
    $json_obj = json_decode($json_str, true);

    $date = $json_obj['date'];

    $events = getEvents($user, $date);
    
    echo json_encode(array(
        "success" => true,
        "data" => $events
    ));
    exit;
?>