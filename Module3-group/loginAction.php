<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>Story Sharing Website</title>
        <link rel="stylesheet" href="style.css" type="text/css">
    </head>
    <body>
        <?php
            require "helpers.php";
            session_start();            
            echo "<h1>" . htmlentities("Story Sharing Website") . "</h1>";

            // check if username is invalid
            if(!preg_match('/^[\w_\.\-]+$/', $_POST['username'])){
                echo "<p>" . htmlentities("Invalid username") . "</p>";
                echo "<p>" . htmlentities("Will redirect to Login Page in " . 3 . " seconds...") . "</p>";
                header('refresh:' . 3 . '; url=login.html');
                exit;
            }
            
            // user data validation
            $user = $_POST['username'];
            $pwd_guess = $_POST['password'];
            // echo loginValidate($user, $pwd_guess);
            if(loginValidate($user, $pwd_guess)){
                // Login succeeded!
                $_SESSION['username'] = $user;
                header("Location: home.php");
            }else{
                unset($_SESSION['username']);
                echo "<p>" . htmlentities("Invalid username or password!") . "</p>";
                echo "<p>" . htmlentities("Will redirect to Login Page in " . 3 . " seconds...") . "</p>";
                header('refresh:' . 3 . '; url=login.html');
                exit;
            }
            
        ?>
    </body>
</html>
