<?php 
	echo "<div class=\"wholeline\">";
	echo "<div class=\"welcome\">" . htmlentities("Welcome, " . $_SESSION['username'] . "!") . "</div>";
	echo 	"<form class=\"sameline\" method=\"POST\" action=\"home.php\">
				<button type=\"submit\" name=\"logOut\" value=\"logout\">Log Out</button>
			</form>";
	echo 	"<form class=\"sameline\" method=\"GET\" action=\"profileEdit.php\">
				<button type=\"submit\">Profile</button>
			</form>";
	echo 	"<form class=\"sameline\" method=\"GET\" action=\"storyAdd.php\">
				<button type=\"submit\">New Story</button>
			</form>";
	echo "</div>";
?> 