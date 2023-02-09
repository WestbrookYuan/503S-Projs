<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>Story Sharing Website</title>
        <link rel="stylesheet" href="style.css" type="text/css">
    </head>
    <body>
        <h1>Story Sharing Website</h1>
        <div style="float: right;">
            <form class="sameline" action="home.php" method="GET">
                <div>
                    <button type="submit">Home</button>
                </div>
            </form>
        </div>
        <div style="text-align: left; width: 60%; margin: 0 auto; vertical-align: middle;">
            
            <form action="profileEditAction.php" method="POST">
                <div class="wholeline">
                        <?php
                            session_start();
                            if(!$_SESSION['username'])
                                header('location: home.php');

                            echo    "<div style=\"width:200px; float:left;\">
                                        <label>" . htmlentities("Username: ") . "</label>
                                    </div>";
                            echo    "<div style=\"width:100px; float:left;\">
                                        <label>" . htmlentities($_SESSION['username']) . "</label>
                                    </div>";
                        ?>
                </div>
                <div class="wholeline">
                    <div style="width:200px; float:left;"><label for="oldPasswordID">Old Password</label></div>
                    <div style="width:100px; float:left;"><input class="login" style="width: 300px;" type="password" name="oldpwd" id="oldPasswordID" required></div>
                </div>
                <div class="wholeline">
                    <div style="width:200px; float:left;"><label for="newPasswordID">New Password</label></div>
                    <div style="width:100px; float:left;"><input class="login" style="width: 300px;" type="password" name="newpwd" id="newPasswordID" required></div>
                </div>

                <div style="text-align: center;">
                    <button type="submit">Confirm</button>
                </div>
            </form>
        </div>
    </body>
</html>