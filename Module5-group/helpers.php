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

    function addEvent($user, $title, $date, $time, $group, $category){
        require "database.php";
        $stmt = $myDB->prepare("INSERT INTO events(user_id, title, DATE, TIME, group_id, category) VALUES (?, ?, ?, ?, ?, ?)");
        if (!$stmt) {
           return "Insert Failed!";
        }
        $stmt->bind_param('ssssss', $user, $title, $date,$time,$group,$category);
        $stmt->execute();
        $stmt->close();
        return "Added!";
    }

    function addGroupEvent($user, $title, $date, $time, $group, $category){
        require "database.php";
        $stmt = $myDB->prepare("SELECT group_users from groups where group_id=?");
        if (!$stmt) {
            # code...
            return "Insert Failed";
        }
        $stmt->bind_param('i', $group);
        $stmt->bind_result($res);
        $stmt->execute();
        $stmt->fetch();
        $groupUsers = explode(";", $res);
        $stmt->close();
        for ($i=0; $i < sizeof($groupUsers); $i++) { 
            # code...
            addEvent($groupUsers[$i], $title, $date, $time, $group, $category);
        }
        return "Inserted";
    }
    function deleteEvent($event_id, $user){
        require "database.php";
        $stmt = $myDB->prepare("SELECT user_id from events WHERE event_id = ?");
        if (!$stmt) {
           return false;
        }
        $stmt->bind_param('i', $event_id);
        $stmt->bind_result($owner);
        $stmt->execute();
        $stmt->fetch();
        $stmt->close();
        if(strcmp($user,$owner)!=0)
        {
            return false;
        }
        if (!isEventExisted($event_id)){
            return 'Not Existed!';
        }
        $stmt = $myDB->prepare("DELETE FROM events WHERE event_id=?");
        if (!$stmt) {
            # code...
            return "Delete Failed";
        }
        $stmt->bind_param('i', $event_id);
        $stmt->execute();
        $stmt->close();
        return "deleted!";

    }
    function isEventExisted($event_id){
        require "database.php";
        $stmt = $myDB->prepare("SELECT count(*) FROM events WHERE event_id=?");
        if(!$stmt){
            return false;
        }
        $stmt->bind_param('i', $event_id);
        $stmt->execute();
        $stmt->bind_result($cnt);
        $stmt->fetch();
        $stmt->close();

        if ($cnt == 0) {
            # code...
            return false;
        }
        return true;
    }

    function editEvent($event_id, $newTitle, $newDate, $newTime, $newCategory, $user)
    {
        require "database.php";

        $stmt = $myDB->prepare("SELECT user_id from events WHERE event_id = ?");
        if (!$stmt) {
           return false;
        }
        $stmt->bind_param('i', $event_id);
        $stmt->bind_result($owner);
        $stmt->execute();
        $stmt->fetch();
        $stmt->close();
        if(strcmp($user,$owner)!=0)
        {
            return false;
        }

        $stmt = $myDB->prepare("UPDATE events SET title = ?, date = ?, time = ?, category = ? WHERE event_id = ?");
        if (!$stmt) {
           return false;
        }
        $stmt->bind_param('sssss', $newTitle, $newDate, $newTime, $newCategory, $event_id);
        $stmt->execute();
        $stmt->close();

        return true;
    }

    function shareEvent($newUser, $newTitle, $newDate, $newTime, $newCategory)
    {
        require "database.php";
        $stmt = $myDB->prepare("INSERT events(user_id, title, DATE, TIME, category) VALUES (?, ?, ?, ?, ?)");
        if (!$stmt) {
           return "cannot share";
        }
        $stmt->bind_param('sssss', $newUser, $newTitle, $newDate, $newTime, $newCategory);
        $stmt->execute();
        $stmt->close();

        return "shared";
    }
    function getEvents($theUser, $theDate)
    {
        require "database.php";
        $stmt = $myDB->prepare("SELECT event_id, user_id, title, DATE, TIME, group_name, category FROM events INNER JOIN groups on events.group_id = groups.group_id where user_id= ? AND date = ?");
        if(!$stmt){
            printf("select Prep Failed: %s\n", $myDB->error);
            exit;
        }
        $stmt->bind_param('ss', $theUser, $theDate);
        $stmt->execute();
        $stmt->bind_result($event_id, $user_id, $title, $date, $time, $group, $category);

        $data = array();

        while($stmt->fetch())
        {
            $event = array(
                "event_id" => $event_id,
                "user_id" => $user_id,
                "title" => $title,
                "date" => $date,
                "time" => $time,
                "group" => $group,
                "category" => $category
            );
            array_push($data, $event);
        }
        $stmt->close();
        return $data;
    }

    function addUser($user, $newPassword) {
        require "database.php";
    
        // user data validation
        $stmt = $myDB->prepare("SELECT COUNT(*) FROM users WHERE user_id = ?");
        if(!$stmt){
            return false;
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
                exit;
            }
            $stmt->bind_param('ss', $user, $newPassword);
            $stmt->execute();
            $stmt->close();
    
            return true;
        }else{
            return false;
        }
    }

    function addGroup($groupName, $groupList){
        require "database.php";
        $stmt = $myDB->prepare("INSERT INTO groups(group_name, group_users) VALUES (?, ?)");
        if (!$stmt) {
            # code...
            return "Add failed";
        }
        $stmt->bind_param('ss', $groupName, $groupList);
        $stmt->execute();
        $stmt->close();
        return "Added!";
    }

    function getAllUsers(){
        require "database.php";
        $stmt = $myDB->prepare("SELECT user_id FROM users");
        if (!$stmt) {
            # code...
            return "not Users";
        }
        $stmt->bind_result($user_id);
        $users = array();
        $stmt->execute();
        while ($stmt->fetch()){
            array_push($users, $user_id);
        }
        $stmt->close();
        return $users;
    }
    
    function getAllGroups(){
        require "database.php";
        $stmt = $myDB->prepare("SELECT group_id, group_name from groups");
        if (!$stmt){
            return "not Groups";
        }
        $groups = array();
        $stmt->bind_result($group_id, $group_name);
        $stmt->execute();
        while ($stmt->fetch()) {
            # code...
            $group = array(
                "group_id" => $group_id,
                "group_name" => $group_name
            );
            array_push($groups, $group);
        }
        return $groups;
    }
    function getMonthCategory($user, $year, $month)
    {
        require "database.php";

        $stmt = $myDB->prepare("SELECT DAY(date), category from events where user_id=? and MONTH(date)=? and YEAR(date)=?");
        if (!$stmt) {
            return false;
        }
        $stmt->bind_param('sss', $user, $month, $year);
        $stmt->bind_result($day, $category);
        
        $data = array();
        $stmt->execute();
        while ($stmt->fetch()){
            $bitMask = ($category == "work"? 4 : ( $category == "daily"? 2 : 1));

            if(!array_key_exists($day, $data))
            {
                $data[$day] = 0 | $bitMask;
            }
            $data[$day] |= $bitMask;
        }
        $stmt->close();
        return $data;
    }
?>