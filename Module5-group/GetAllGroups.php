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

    $data = getAllGroups();
    echo json_encode($data);
?>