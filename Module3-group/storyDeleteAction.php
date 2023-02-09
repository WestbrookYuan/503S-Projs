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
            // login state check
            if(!$_SESSION['username'])
            {
                header('location: home.php');
            }
            
            $storyID = $_POST['storyID'];
            deleteStory($storyID);

            echo "<p>" . htmlentities("Story successfully deleted!") . "</p>";
            echo "<p>" . htmlentities("Going back to Home Page in " . 3 . " seconds...") . "</p>";
            header('refresh:' . 3 . '; url=home.php');
        ?>
    </body>
</html>
