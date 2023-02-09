<?php
    function loginValidate($user, $pwd_guess): bool {
        require "database.php";
        $stmt = $myDB->prepare("SELECT COUNT(*), user_id, pwd FROM users WHERE user_id = ?");
        if(!$stmt){
            printf("select Prep Failed: %s\n", $myDB->error);
            exit;
        }

        // Bind the parameter
        $stmt->bind_param('s', $user);
        $stmt->execute();

        // Bind the results
        $stmt->bind_result($cnt, $user_id, $pwd_hash);
        $stmt->fetch();
        $stmt->close();

        return $cnt === 1 && password_verify($pwd_guess, $pwd_hash);
    }

    function addUser($user, $newPassword) {
        require "database.php";

        // user data validation
        $stmt = $myDB->prepare("SELECT COUNT(*) FROM users WHERE user_id = ?");
        if(!$stmt){
            printf("select Prep Failed: %s\n", $myDB->error);
            exit;
        }

        // Bind the parameter
        $stmt->bind_param('s', $user);
        $stmt->execute();
        // Bind the results
        $stmt->bind_result($cnt);
        $stmt->fetch();
        $stmt->close();

        // Check if username already exists
        if($cnt === 0){
            // no duplicate username
            $stmt = $myDB->prepare("INSERT INTO users(user_id, pwd) VALUES (?, ?)");
            if(!$stmt){
                printf("insert Prep Failed: %s\n", $myDB->error);
                exit;
            }
            $stmt->bind_param('ss', $user, $newPassword);
            $stmt->execute();
            $stmt->close();

            echo "<p>" . htmlentities("Account successfully created!") . "</p>";
            $sec = 3;
            echo "<p>" . htmlentities("Will redirect to Login Page in " . $sec . " seconds...") . "</p>";
            header('refresh:' . $sec . '; url=login.html');
        }else{
            echo "<p>" . htmlentities("Duplicate username!") . "</p>";
            $sec = 3;
            echo "<p>" . htmlentities("Will redirect to Register Page in " . $sec . " seconds...") . "</p>";
            header('refresh:' . $sec . '; url=register.html');
            exit;
        }
    }

    function changePassword($user, $newpwd){
        require "database.php";
        $stmt = $myDB->prepare("UPDATE users SET pwd = ? WHERE user_id = ?");
        if(!$stmt){
            printf("select Prep Failed: %s\n", $myDB->error);
            exit;
        }

        // Bind the parameter
        $stmt->bind_param('ss', $newpwd, $user);
        $stmt->execute();

        $stmt->close();
    }

    function showAllStories(){
        require "database.php";
        $stmt = $myDB->prepare("SELECT * FROM stories");
        if(!$stmt){
            printf("select Prep Failed: %s\n", $myDB->error);
            exit;
        }
        $stmt->execute();
        $stmt->bind_result($storyID, $storyOwner, $title, $body, $link, $likes);
        while($stmt->fetch())
        {
            showOneStoryCard($_SESSION['username'], $storyID, $storyOwner, $title, $body, $link, $likes);
        }
        $stmt->close();
    }

    function showUserStories($user){
        require "database.php";
        $stmt = $myDB->prepare("SELECT * FROM stories where user_id= ?");
        if(!$stmt){
            printf("select Prep Failed: %s\n", $myDB->error);
            exit;
        }
        $stmt->bind_param('s', $user);
        $stmt->execute();
        $stmt->bind_result($storyID, $storyOwner, $title, $body, $link, $likes);
        while($stmt->fetch())
        {
            showOneStoryCard($user, $storyID, $storyOwner, $title, $body, $link, $likes);
        }
        $stmt->close();
    }

    function showOneStoryCard($user, $storyID, $storyOwner, $title, $body, $link, $likes)
    {
        echo '<div class="story">';
        echo "<div class=\"wholeline\">";
        echo "<h2>" . htmlentities($title) . "</h2>";

        // if owner, show edit and delte button
        if($user === $storyOwner)
        {
            echo "<form class=\"sameline\" method=\"POST\" action=\"storyEdit.php\">
                    <input style=\"display:none;\" type = \"text\" name=\"storyID\" value=\"" . htmlentities($storyID) . "\" readonly></input>
                    <input style=\"display:none;\" type = \"text\" name=\"userID\" value=\"" . htmlentities($storyOwner) . "\" readonly></input>
                    <input style=\"display:none;\" type = \"text\" name=\"title\" value=\"" . htmlentities($title) . "\" readonly></input>
                    <input style=\"display:none;\" type = \"text\" name=\"body\" value=\"" . htmlentities($body) . "\" readonly></input>
                    <input style=\"display:none;\" type = \"text\" name=\"link\" value=\"" . htmlentities($link) . "\" readonly></input>
                    <button type=\"submit\">" . htmlentities("Edit") . "</button>
                 </form>";
            echo "<form class=\"sameline\" method=\"POST\" action=\"storyDeleteAction.php\">
                    <input style=\"display:none;\" type = \"text\" name=\"storyID\" value=\"" . htmlentities($storyID) . "\" readonly></input>
                    <button class=\"alert\" type=\"submit\">" . htmlentities("Delete") . "</button>
                 </form>";
        }
        echo '</div>';
        echo "<h3> Shared by: " . htmlentities($storyOwner) . "</h3>";
        echo "<p>" . htmlentities($body) . "</p>";
        echo "<p>Link: <a href=" . htmlentities($link) . ">" . htmlentities($link) . "</a></p>";
        echo "<p> Likes:".htmlentities($likes)."</p>"; 
        echo "<hr class=\"solid\">";
        // comment
        // if login, show comment button
        if($user)
        {
            echo "<div class=\"wholeline\">";
            echo "<form id=\"" . htmlentities("form" . $storyID) . "\" class=\"sameline\" style=\"margin-top:10px; display: none; text-align: center;\" method=\"POST\" action=\"addCommentAction.php\">
            <input style=\"display:none;\" type = \"text\" name=\"storyID\" value=\"" . htmlentities($storyID) . "\"></input>
            <textarea class=\"body\" placeholder=\"Say something here...\" name=\"commentBody\" required></textarea>
            <button type=\"submit\">" . htmlentities("Confirm") . "</button>
            </form>";
            echo "</div>";

            echo "<div class=\"wholeline\">";
            echo "<button id=\"" . htmlentities("btn" . $storyID) . "\">Comment</button>
                    <script>
                    function showCommentForm(formID)
                    {
                        const form = document.getElementById(formID);

                        if (form.style.display === 'none') {
                            form.style.display = 'block';
                        } else {
                            form.style.display = 'none';
                        }
                    }
                    cmtBtn = document.getElementById(\"" . htmlentities("btn" . $storyID) . "\");
                        cmtBtn.addEventListener('click', ()=>{
                            showCommentForm(\"" . htmlentities("form" . $storyID) . "\");
                        });
                    </script>";
            echo '<form method="post">';
            echo '<button type="submit" name='. $storyID.'>like</button>';
            if (isset($_POST[$storyID])){
                LikePost($user, $storyID);
            }
            echo '</form>';
            echo "</div>";
        }
        if ($user) {
            # if login show like button
        }
        echo "<hr class=\"transparent\">";
        showStoryComment($user, $storyID);
        echo "</div>";
    }

    function showStoryComment($user, $story_id){
        require "database.php";
        $stmt = $myDB->prepare("SELECT comments.id, comments.story_id, comments.comment_owner, comments.body FROM stories inner join comments on comments.story_id=stories.story_id where stories.story_id=?");
        if(!$stmt){
            printf("select Prep Failed: %s\n", $myDB->error);
            exit;
        }
        $stmt->bind_param('i', $story_id);
        $stmt->execute();
        $stmt->bind_result($commentID, $storyID, $commentOwner, $body);
        while($stmt->fetch())
        {
            showOneCommentCard($user, $commentID, $storyID, $commentOwner, $body);
        }
        $stmt->close();
    }

    function showOneCommentCard($user, $commentID, $storyID, $commentOwner, $body){
        echo '<div class="comment">';

        echo "<hr>";
        
        echo "<div class=\"wholeline\">";
        echo "<h3>";
        echo "<div style=\"float:left;\">" . htmlentities($commentOwner) . "</div>";
        // comment edit and delete
        if($user === $commentOwner)
        {
            // echo "<form class=\"sameline\" method=\"POST\" action=\"commentEditAction.php\">
            //         <input style=\"display:none;\" type = \"text\" value=\"" . htmlentities($commentID) . "\"></input>
            //         <button type=\"submit\" class=\"cmtAction\">" . htmlentities("Edit") . "</button>
            //      </form>";
            echo "<div class=\"wholeline\">";
            echo "<form id=\"" . htmlentities("cmtform" . $commentID) . "\" class=\"sameline\" style=\"margin-top:10px; display: none; text-align: center;\" method=\"POST\" action=\"CommentEditAction.php\">
            <input style=\"display:none;\" type = \"text\" name=\"commentID\" value=\"" . htmlentities($commentID) . "\"></input>
            <textarea class=\"body\" name=\"commentBody\" required>" . htmlentities($body) . "</textarea>
            <button type=\"submit\">" . htmlentities("Confirm") . "</button>
            </form>";
            echo "</div>";
            echo "<button class=\"cmtAction\" style=\"float:left;padding-top: 7px;\" id=\"" . htmlentities("cmtbtn" . $commentID) . "\">Edit</button>
                    <script>
                    function showCommentForm(formID)
                    {
                        const form = document.getElementById(formID);

                        if (form.style.display === 'none') {
                            form.style.display = 'block';
                        } else {
                            form.style.display = 'none';
                        }
                    }
                    cmtBtn = document.getElementById(\"" . htmlentities("cmtbtn" . $commentID) . "\");
                        cmtBtn.addEventListener('click', ()=>{
                            showCommentForm(\"" . htmlentities("cmtform" . $commentID) . "\");
                        });
                    </script>";

            echo "<form class=\"sameline\" method=\"POST\" action=\"commentDeleteAction.php\">
                    <input style=\"display:none;\" type = \"text\" name=\"commentID\" value=\"" . htmlentities($commentID) . "\"></input>
                    <button type=\"submit\" class=\"cmtAction\">" . htmlentities("Delete") . "</button>
                 </form>";
        }
        
        echo "</h3>";
        echo "</div>";

        echo "<p>" . $body . "</p>";
        echo '</div>';
    }

    function addComment($storyID, $user, $cmtBody)
    {
        require "database.php";
        $stmt = $myDB->prepare("INSERT INTO comments(story_id, comment_owner, body) VALUES (?,?,?)");
        if(!$stmt){
            printf("insert Prep Failed: %s\n", $myDB->error);
            exit;
        }
        $stmt->bind_param('iss', $storyID, $user, $cmtBody);
        $stmt->execute();
        $stmt->close();
    }

    function addStory($user, $newTitle, $newBody, $newLink)
    {
        require "database.php";
        $stmt = $myDB->prepare("INSERT INTO stories(user_id, title, body, link) VALUES (?,?,?,?)");
        if(!$stmt){
            printf("insert Prep Failed: %s\n", $myDB->error);
            exit;
        }
        $stmt->bind_param('ssss', $user, $newTitle, $newBody, $newLink);
        $stmt->execute();
        $stmt->close();
    }

    function deleteStoryComment($comment_id){
        require "database.php";
        $stmt = $myDB->prepare("delete FROM comments where id=?");
        if(!$stmt){
            printf("select Prep Failed: %s\n", $myDB->error);
            exit;
        }
        $stmt->bind_param('i', $comment_id);
        $stmt->execute();
        $stmt->close();
    }

    function deleteStory($story_id){
        #delete comments
        require "database.php";

        $stmt = $myDB->prepare("DELETE FROM comments where story_id=?");
        if(!$stmt){
            printf("select Prep Failed: %s\n", $myDB->error);
            exit;
        }
        $stmt->bind_param('i', $story_id);
        $stmt->execute();
        $stmt->close();
        #delete like record
        require "database.php";
        $stmt = $myDB->prepare("DELETE FROM likesRecord where story_id=?");
        if(!$stmt){
            printf("select Prep Failed: %s\n", $myDB->error);
            exit;
        }
        $stmt->bind_param('i', $story_id);
        $stmt->execute();
        $stmt->close();

        require "database.php";
        $stmt = $myDB->prepare("DELETE FROM stories where story_id=?");
        if(!$stmt){
            printf("select Prep Failed: %s\n", $myDB->error);
            exit;
        }
        $stmt->bind_param('i', $story_id);
        $stmt->execute();
        $stmt->close();
    }

    function alterStory($story_id, $user_id, $title, $body, $link){
        require "database.php";
        $stmt = $myDB->prepare("UPDATE stories SET user_id=?,title=?,body=?,link=? WHERE story_id=?");
        if(!$stmt){
            printf("select Prep Failed: %s\n", $myDB->error);
            exit;
        }
        $stmt->bind_param('ssssi', $user_id, $title, $body, $link, $story_id);
        $stmt->execute();
        $stmt->close();
    }

    function alterStoryComment($comment_id, $body){
        require "database.php";
        $stmt = $myDB->prepare("UPDATE comments SET body=? WHERE id=?");
        if(!$stmt){
            printf("select Prep Failed: %s\n", $myDB->error);
            exit;
        }
        $stmt->bind_param('si', $body, $comment_id);
        $stmt->execute();
        $stmt->close();
    }

    function checkLiked($user_id, $story_id){
        require "database.php";
        $stmt = $myDB -> prepare("SELECT user_id, story_id FROM likesRecord WHERE user_id=? AND story_id=?");
        if(!$stmt){
            printf("select Prep Failed: %s\n", $myDB->error);
            exit;
        }
        $stmt->bind_param('si', $user_id, $story_id);
        $stmt->execute();
        $stmt->bind_result($exist_user_id, $exist_story_id);
        while ($stmt->fetch()){
                return false;
        }
        $stmt->close();
        return true;
    }
    function showLike($story_id){
        require "database.php";
        $stmt = $myDB->prepare("SELECT likes FROM stories where story_id=?");
            if(!$stmt){
                printf("select Prep Failed: %s\n", $myDB->error);
                exit;
            }
            $stmt->bind_param('i', $story_id);
            $stmt->execute();
            $stmt->bind_result($likes);
            while($stmt->fetch())
            {
                return $likes;
            }
            $stmt->close();

            
    }
    function insertRecord($user_id, $story_id){
        require "database.php";
        $stmt = $myDB->prepare("INSERT INTO likesRecord(user_id, story_id) VALUES (?, ?)");
        if(!$stmt){
            printf("select Prep Failed: %s\n", $myDB->error);
            exit;
        }
        $stmt->bind_param('si', $user_id, $story_id);
        $stmt->execute();
        $stmt->close();
    }
    function LikePost($user_id, $story_id){
        require "database.php";
        if (checkLiked($user_id, $story_id)) {
            # code...
            $stmt = $myDB->prepare("UPDATE stories SET likes=likes+1 where story_id=?");
            if(!$stmt){
                printf("select Prep Failed: %s\n", $myDB->error);
                exit;
            }
            $stmt->bind_param('i', $story_id);
            $stmt->execute();
            $stmt->close();
            insertRecord($user_id, $story_id);
            header('refresh:1');
        }
        else {
            # code...
            echo "<p>" . htmlentities("Liked!") ."</p>";
            header('refresh:1');
        }
    }
?>