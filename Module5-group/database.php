<?php
    $myDB = new mysqli('localhost', 'wustl_inst', 'wustl_pass', 'module5');
    if($myDB->connect_errno)
    {
        echo "<p>" . htmlentities("Connection Failed:") . "</p><br>";
        echo "<p>" . htmlentities($mysqli->connect_error) . "</p>";
        exit;
    }
?>