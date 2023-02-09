// var socket = io.connect('http://ec2-18-116-44-41.us-east-2.compute.amazonaws.com:3456/');
var socket = io.connect('http://ec2-18-119-98-104.us-east-2.compute.amazonaws.com:3456/'); // Hive's EC2

var current_room = null;

socket.on("connect", function(){
    users = login();
    socket.emit('login', users);

});

socket.on("login_feedback", function(data) {
    if(data['success'])
    {
        if (data["currentUser"] != undefined) {
            socket['userName'] = data["currentUser"];
        }
        alert("Successfully login!");
        refreshGroups(socket['userName'], data['rooms']);
    }else {
        alert("Failed to login: incorrect password!");
        refreshGroups(socket['userName'], {});
    }
    
    displayMembers();
});

socket.on("create_room_feedback", function(data) {
    refreshGroups(socket['userName'], data['rooms']);
});

socket.on('join_room_feedback', function(data){
    current_room = data['cur_room'];
    let rooms = data['rooms'];
    refreshGroups(socket['userName'], rooms);
    if (current_room != null){
        displayMembers(rooms[current_room]);
        socket.emit("message_to_server", {});
    }else {
        alert('Join failed! You are banned from this room!');
    }
});

socket.on("message_to_client", function(data) {
    let chatData = data[current_room];
    displayChatPage(socket["userName"], current_room, chatData);
});

socket.on('new_member_to_room', function(data){
    if(current_room == data['cur_room'])
    {
        let rooms = data['rooms'];
        displayMembers(rooms[current_room]);
    }
});

socket.on('got_kicked', function(data){
    current_room = null;
    alert('You are kicked from room ' + data['cur_room']);
    // update group list
    refreshGroups(socket['userName'], data['rooms']);
    // update member list
    displayMembers();
    // clear chat window
    displayChatHeader();
    const parent = document.getElementById("chat_page");
    let chat_history = document.getElementById("chat_history");
    if (chat_history)
        parent.removeChild(chat_history);
    socket.emit("leave", data);
})

socket.on('got_quit', function(data){
    current_room = null;
    alert('Successfully quit the room ' + data['cur_room']);
    // update group list
    refreshGroups(socket['userName'], data['rooms']);
    // update member list
    displayMembers();
    // clear chat window
    displayChatHeader();
    const parent = document.getElementById("chat_page");
    let chat_history = document.getElementById("chat_history");
    if (chat_history)
        parent.removeChild(chat_history);
    socket.emit("leave", data);
})

// create group
$(function(){
    document.getElementById("create_group_btn").addEventListener("click", function(){
        document.getElementById("addGroupForm").style.display = 'block';
    });
    document.getElementById("addGroup_cancel").addEventListener("click", function(){
        document.getElementById("addGroupForm").style.display = 'none';
    });
    document.getElementById("addGroup_confirm").addEventListener("click", function(){
        let data = groupInfo();
        if(!data['name'] || data['name'] == "")
        {
            alert("Room name should not be empty!");
            return;
        }
        if(data['private'] && data['password'] == "")
        {
            alert("Private room must have password!");
            return;
        }
        socket.emit("create_room", data);
        alert("room successfully created!");

        const newGroup = document.getElementById("new_group");
        const isPrivate = document.getElementById("private");
        const privatePwd = document.getElementById("private_room_pwd");
        newGroup.value = "";
        isPrivate.checked = false;
        privatePwd.value = "";
        document.getElementById("addGroupForm").style.display = 'none';
    });
    document.getElementById("quit").addEventListener("click", function(event){
        tryToQuitRoom(socket['userName'], event.currentTarget.value);
    });

    document.getElementById("search_group").addEventListener("keyup", function(event){
        // we refer to this code from https://www.w3schools.com/howto/howto_js_filter_lists.asp
        let input = event.currentTarget.value;
        filter = input.toUpperCase();
        group_ul = document.getElementById("groups");
        if(!group_ul) return;
        li = group_ul.getElementsByTagName('li');

        for (i = 0; i < li.length; i++) {
            a = li[i].getElementsByClassName("name")[0];
            let txtValue = a.textContent || a.innerText;
            if (filter == "" || txtValue.toUpperCase().indexOf(filter) > -1) {
                li[i].style.display = "";
            } else {
                li[i].style.display = "none";
            }
        }
    });

    document.getElementById("search_member").addEventListener("keyup", function(event){
        // we refer to this code from https://www.w3schools.com/howto/howto_js_filter_lists.asp
        let input = event.currentTarget.value;
        filter = input.toUpperCase();
        group_ul = document.getElementById("members");
        if(!group_ul) return;
        li = group_ul.getElementsByTagName('li');

        for (i = 0; i < li.length; i++) {
            a = li[i].getElementsByClassName("name")[0];
            let txtValue = a.textContent || a.innerText;
            if (filter == "" || txtValue.toUpperCase().indexOf(filter) > -1) {
                li[i].style.display = "";
            } else {
                li[i].style.display = "none";
            }
        }
    });
});


// send message
$(function() {
    const sendBtn = document.getElementById("sendBtn");
    sendBtn.addEventListener("click", function() {
        const private = document.getElementById("private_user");
        if (!private){
            sendMessage(null, sendBtn.value);
        }

        else{
            sendMessage(private.value, sendBtn.value);
        }
        
    });
    
});
