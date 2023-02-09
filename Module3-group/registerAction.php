<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>Story Sharing Website</title>
        <link rel="stylesheet" href="style.css" type="text/css">
    </head>
    <body>
        <?php
            require "database.php";
            require "helpers.php";
            session_start();
            
            echo "<h1>" . htmlentities("Story Sharing Website") . "</h1>";

            // check if username is invalid
            if(!preg_match('/^[\w_\.\-]+$/', $_POST['username'])){
                echo "<p>" . htmlentities("Invalid username") . "</p>";
                $sec = 3;
                echo "<p>" . htmlentities("Will redirect to Register Page in " . $sec . " seconds...") . "</p>";
                header('refresh:' . $sec . '; url=register.html');
                exit;
            }

            $user = $_POST['username'];
            $newPassword = password_hash($_POST['password'], PASSWORD_BCRYPT);
            addUser($user, $newPassword);
        ?>
    </body>
</html>
