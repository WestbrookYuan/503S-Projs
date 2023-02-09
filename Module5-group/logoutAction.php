<?php
	header("Content-Type: application/json");
	require 'helpers.php';
	ini_set("session.cookie_httponly", 1);
	session_start();
	session_destroy();

	echo json_encode(array(
		"success" => true,
		"message" => "Successfully log out!",
		// "username" => $_SESSION['username']
	));
	exit;
?>