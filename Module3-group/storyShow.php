<?php
    require "helpers.php";
    $title = "sb";
    $user = "sb";
    $comment_user = "sb";
    $comment = "sb";
    $body = "sb";
    $likes = showLike(1);
    $link = "https://www.javatpoint.com/php-session#:~:text=PHP%20session%20is%20used%20to%20store%20and%20pass,product%20price%20etc%20from%20one%20page%20to%20another.";
    LikePost('stb', 1);
    
?>


<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="style.css">
    <title><?php echo $title?></title>
</head>
<body>
    <?php
        echo '<div class="story">';
        echo "<div class=\"wholeline\">";
        echo "<h2>" . $title . "</h2>";
        echo "<form class=\"sameline\" method=\"GET\" action=\"storyEdit.php\">
                <button type=\"submit\">" . htmlentities("Edit") . "</button>
             </form>";
        echo "<form class=\"sameline\" method=\"GET\" action=\"storyEdit.php\">
                <button type=\"submit\">" . htmlentities("Delete") . "</button>
             </form>";
        echo '</div>';
        echo "<h3> Shared by:" . $user . "</h3>";
        echo "<p>" . $body . "</p>";
        echo "<p><a href=" . $link. "> Here is the Link </a></p>";
        echo "<p> Likes:".$likes."</p>";
        echo '<button name="like" type="submit">Like</button>';
        if (isset($_POST['like'])){
            LikePost('russell', 1);
        }
        echo '<div class="comment">';
        echo "<h3>" . $comment_user . "</h3>";
        echo "<p>" . $comment . "</p>";
        echo '</div>';
        echo "</div>";

    ?>


    
</body>
</html>


