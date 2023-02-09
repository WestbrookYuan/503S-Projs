<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>Story Sharing Website</title>
        <link rel="stylesheet" href="style.css" type="text/css">
    </head>
    <body>
        <?php
            session_start();
            // login state check
            if(!$_SESSION['username'])
            {
                header('location: home.php');
            }
        ?>
        <h1>Story Sharing Website</h1>
        <div style="float: right;">
            <form class="sameline" action="home.php" method="GET">
                <div>
                    <button type="submit">Home</button>
                </div>
            </form>
        </div>
        <div style="text-align: left; width: 60%; margin: 0 auto; vertical-align: middle;">
            <h2>Create a New Story</h2>
            <form action="storyEditAction.php" method="POST">
                <div class="input">
                    <div>
                        <div><label for="titleID">Title</label></div>
                        <div><input class="titletext" type="text" name="newTitle" value="<?php echo htmlentities($_POST['title'])?>" id="titleID" required></div>
                    </div>
                    
                    <div>
                        <div><label for="bodyID">Body</label></div>
                        <div><textarea class="body" name="newBody" maxlength="1536"><?php echo htmlentities($_POST['body'])?></textarea></div>
                    </div>

                    <div>
                        <div><label for="linkID">Link</label></div>
                        <div><input class="linktext" type="text" name="newLink" value="<?php echo htmlentities($_POST['link'])?>" id="linkID" required></div>
                    </div>

                    <input style="display: none;" type="text" name="storyID" value="<?php echo htmlentities($_POST['storyID'])?>" readonly>
                    <input style="display: none;" type="text" name="userID" value="<?php echo htmlentities($_POST['userID'])?>" readonly>
                </div>

                <div style="text-align: center;">
                    <button type="submit">Publish</button>
                </div>
            </form>
        </div>
    </body>
</html>