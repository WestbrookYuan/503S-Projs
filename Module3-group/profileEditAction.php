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
            // login state check
            if(!$_SESSION['username'])
            {
                header('location: home.php');
            }
            
            $user = $_SESSION['username'];
            $oldpwd = $_POST['oldpwd'];
            $newpwd = password_hash($_POST['newpwd'], PASSWORD_BCRYPT);
            if(loginValidate($user, $oldpwd))
            {
                // modify user info
                changePassword($user, $newpwd);

                echo "<p>" . htmlentities("Password successfully changed!") . "</p>";
                echo "<p>" . htmlentities("Will redirect to Home Page in " . 3 . " seconds...") . "</p>";
                header('refresh:' . 3 . '; url=home.php');
            }else{
                echo "<p>" . htmlentities("Invalid username or password!") . "</p>";
                echo "<p>" . htmlentities("Will redirect to Profile Page in " . 3 . " seconds...") . "</p>";
                header('refresh:' . 3 . '; url=profileEdit.php');
                exit;
            }

        ?>
    </body>
</html>
