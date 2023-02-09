<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>File Sharing System</title>
        <link rel="stylesheet" href="style.css">
    </head>
    <body>
        <h1>File Sharing System</h1>
        
        <?php
            session_start();

            // check username
            $userName = $_SESSION['username'];
            if(!$userName)
            {
                echo "<p>" . htmlentities("Invalid username or password!") . "</p>";
                $sec = 3;
                echo "<p>" . htmlentities("Will redirect to Home Page in " . $sec . " seconds...") . "</p>";
                header('refresh:' . $sec . '; url=login.html');
                exit;
            }
            else {
                header("Location: welcome.php");
            }
        ?>
    </body>
</html>