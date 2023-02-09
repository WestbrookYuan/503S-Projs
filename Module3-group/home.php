<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>Story Sharing Website</title>
        <link rel="stylesheet" href="style.css" type="text/css">
    </head>
    <body>
        <h1>Story Sharing Website</h1>
        <?php
            require "helpers.php";
            session_start();

            // if clicked logout button
            if(array_key_exists('logOut', $_POST))
            {
                session_destroy();
                header('location:home.php');
            }

            // if logged in, show welcome page
            if($_SESSION['username'])
            {
                include "welcome.php";
            }
            // if not logged in, show login and register buttons
            else{
                echo    "<div class=\"wholeline\">
                            <div style=\"float: right;\">
                                <form class=\"sameline\" action=\"login.html\" method=\"GET\">
                                    <div>
                                        <button type=\"submit\">Log In</button>
                                    </div>
                                </form>
                                <form class=\"sameline\" action=\"register.html\" method=\"GET\">
                                    <div>
                                        <button type=\"submit\">Register</button>
                                    </div>
                                </form>
                            </div>
                        </div>";
            }
            echo "<hr>";
            showAllStories();
            
        ?>
        
    </body>
</html>