function login(){
    var user = prompt("Please input your name: ");
    var pwd = prompt("please input your password");
    if (user != null && user != "" && pwd != null && pwd != ""){
        return {"user":user, 
                "pwd": pwd
                };
    }
    else{
        return null;
    }
}

function displayMembers(groupData=null){
    const header = document.getElementById("memberHeader_title");

    const parent = document.getElementById("member_list");
    let members = document.getElementById("members");
    if (members) {
        parent.removeChild(members);
    }
    members = document.createElement("ul");
    members.id = "members";
    members.setAttribute("class", "list");
    parent.appendChild(members);
    
    if(!groupData){
        header.textContent = "";
        return;
    }

    header.textContent = groupData['name'];
    let memberList = groupData['members'];
    let owner = groupData['creator'];
    for(let member of memberList)
        members.appendChild(createOneMemberCard(member, owner));
}

function createOneMemberCard(userName, owner) {
    let li = document.createElement("li");
    li.addEventListener("dblclick", (event) =>{
        const parent = document.getElementById("message_div");
        const position = document.getElementById("message-to-send")
        let private_user = document.getElementById("private_user");
        if (private_user)
            parent.removeChild(private_user);
        if (socket['userName'] != userName) {
            private_user = document.createElement("button");
            private_user.id = "private_user";
            private_user.value = userName;
            private_user.innerHTML = "private message to: " + userName + " (click to cancel)";
            private_user.addEventListener("click", function() {
                parent.removeChild(private_user);
            });
            private_user.style.fontSize = "10px";
            parent.insertBefore(private_user, position);
        }
        
    });
    li.setAttribute("class", "clearfix");
    li.id = userName;
    let image = document.createElement("img");
    image.src = "./images/member.jpg";
    image.alt = "avatar";
    li.appendChild(image);
    let aboutDiv = document.createElement("div");
    aboutDiv.setAttribute("class", "about");

    let nameDiv = document.createElement("div");
    nameDiv.setAttribute("class", "name");
    nameDiv.innerHTML = userName;
    aboutDiv.appendChild(nameDiv);

    let manageDiv = document.createElement("div");
    manageDiv.setAttribute("class", "manage");
    aboutDiv.appendChild(manageDiv);

    if(socket['userName'] == owner && userName != owner)
    {
        let kickBtn = document.createElement("button");
        kickBtn.setAttribute("class", "kick");
        kickBtn.id = "kick_" + userName;
        kickBtn.value = current_room;
        kickBtn.textContent = "kick";
        kickBtn.addEventListener('click', function(event){
            tryToKickMember(event.currentTarget.id.substring(5, event.currentTarget.id.length), event.currentTarget.value);
        });
        manageDiv.appendChild(kickBtn);

        let banBtn = document.createElement("button");
        banBtn.setAttribute("class", "ban");
        banBtn.id = "ban_" + userName;
        banBtn.value = current_room;
        banBtn.textContent = "ban";
        banBtn.addEventListener('click', function(event){
            tryToBanMember(event.currentTarget.id.substring(4, event.currentTarget.id.length), event.currentTarget.value);
        });
        manageDiv.appendChild(banBtn);
    }

    li.appendChild(aboutDiv);
    return li;
}

function refreshGroups(user, rooms) {
    
    const groupList = document.getElementById("group_list");
    let groups = document.getElementById("groups");
    if (groups) {
        groupList.removeChild(groups);
    }
    groups = document.createElement("ul");
    groups.setAttribute('class', 'list');
    groups.id = 'groups';

    if(!user) return;
    groupList.appendChild(groups);

    // create group cards
    for(let key in rooms)
        groups.appendChild(createOneGroupCard(user, rooms[key]));
}

function createOneGroupCard(user, groupData) {
    let liElement = document.createElement('li');
    liElement.id = groupData['name'];
    liElement.setAttribute('class', 'clearfix');
    liElement.addEventListener('dblclick', (event)=>{ 
        tryToJoinRoom(user, groupData);
    });

    let avtELement = document.createElement('img');
    avtELement.src = "./images/group.jpg";
    avtELement.alt = "avatar";
    liElement.appendChild(avtELement);

    let aboutElement = document.createElement('div');
    aboutElement.setAttribute('class', 'about');
    liElement.appendChild(aboutElement);

    let nameElement = document.createElement('div');
    nameElement.setAttribute('class', 'name');
    nameElement.textContent = groupData['name'];
    aboutElement.appendChild(nameElement);

    let statusElement = document.createElement('div');
    statusElement.setAttribute('class', 'status');
    aboutElement.appendChild(statusElement);

    let iElement = document.createElement('i');
    statusElement.appendChild(iElement);

    let memberList = groupData['members'];

    // if the group is private
    if(groupData['private'])
    {
        // display lock icon
        let lockImgElement = document.createElement('img');
        lockImgElement.setAttribute('class', 'lock');
        lockImgElement.src = './images/lock.png';
        lockImgElement.alt = 'private';
        iElement.appendChild(lockImgElement);
    }

    // if user has joined the group
    if(memberList.includes(user)){
        // display joined
        iElement.setAttribute('class', 'fa fa-circle joined');
        iElement.appendChild(document.createTextNode('joined'));
    }else {
        // display not joined
        iElement.setAttribute('class', 'fa fa-circle not_joined');
        iElement.appendChild(document.createTextNode('not joined'));
    }

    return liElement;
}

function groupInfo() {
    const newGroup = document.getElementById("new_group");
    const isPrivate = document.getElementById("private");
    const privatePwd = document.getElementById("private_room_pwd");
    let data = {
        "name" : newGroup.value, // name of the room
        "creator" : socket["userName"], // owner of the room
        "private" : isPrivate.checked, // 0: no password, 1: with password
        "password" : privatePwd.value, // only be used when private is 1
        "members" : [socket["userName"]],  // list of users who are currently in this room
        "banned_list" : {}
    };
    return data;
}

function displayChatPage(current_user, current_room, chatData){
    displayChatHeader();

    const parent = document.getElementById("chat_page");
    let chat_history = document.getElementById("chat_history");
    const chat_group = document.getElementById("chat_group");
    const send_btn = document.getElementById("sendBtn");
    send_btn.value = current_room;
    chat_group.innerHTML = current_room;
    if (chat_history)
        parent.removeChild(chat_history);
    
    chat_history = document.createElement("ul");
    chat_history.id = "chat_history";
    if(!chatData) return;
    for (let i = 0; i < chatData.length; i++) {
        let li;
        if (chatData[i]["senter"] == current_user){
            li = createMyMessage(chatData[i]);
            chat_history.appendChild(li);
        }
        else{
            li = createOtherMessage(current_user, chatData[i]);
            if (li != null)
                chat_history.appendChild(li);
        }     
    }
    parent.appendChild(chat_history);
}

function displayChatHeader() {
    const chat_group = document.getElementById("chat_group");
    const quitBtn = document.getElementById("quit");
    if(current_room == null) {
        chat_group.innerHTML = "";
        quitBtn.style.display = "none";
    }else {
        chat_group.innerHTML = current_room;
        quitBtn.style.display = "block";
        quitBtn.value = current_room;
    }
}

function createMyMessage(messageInfo) {
    let li = document.createElement("li");
    let profilediv = document.createElement("div");
    let messageDiv = document.createElement("div");
    li.appendChild(profilediv);
    let img = document.createElement("img");
    li.setAttribute("class", "clearfix");
    profilediv.setAttribute("class", "message-data align-right");
    img.setAttribute("class", "align-right");
    messageDiv.setAttribute("class", "message my-message float-right");        
    let timeSpan = document.createElement("span");
    timeSpan.setAttribute("class", "message-data-time");
    timeSpan.innerHTML = messageInfo["time"] + "&nbsp; &nbsp;";
    profilediv.appendChild(timeSpan);
    let nameSpan = document.createElement("span");
    nameSpan.setAttribute("class", "message-data-name");
    profilediv.appendChild(nameSpan);
    let iele = document.createElement("i");
    iele.setAttribute("class", "fa fa-circle private");
    if (messageInfo["private"] == 1 && messageInfo['receiver'] != ""){
        iele.innerHTML = "(private to " + messageInfo['receiver'] + ")";
    }
    nameSpan.innerHTML = messageInfo['senter'];
    img.src = "/images/member.jpg";
    img.alt = "avatar";
    nameSpan.appendChild(iele);
    nameSpan.appendChild(img);
    messageDiv.innerHTML = messageInfo["content"];
    li.appendChild(messageDiv);
    return li;
}

function createOtherMessage(current_user, messageInfo) {
    let li = document.createElement("li");
    let profilediv = document.createElement("div");
    let messageDiv = document.createElement("div");
    li.appendChild(profilediv);
    profilediv.setAttribute("class", "message-data");
    messageDiv.setAttribute("class", "message other-message");  
    let nameSpan = document.createElement("span");
    nameSpan.setAttribute("class", "message-data-name");
    profilediv.appendChild(nameSpan);      
    let timeSpan = document.createElement("span");
    timeSpan.setAttribute("class", "message-data-time");
    timeSpan.innerHTML = messageInfo["time"] + "&nbsp; &nbsp;";
    profilediv.appendChild(timeSpan);
    let ielestr = "";
    if (messageInfo["private"] == 1 && messageInfo['receiver'] != ""){
        ielestr = "(private to " + messageInfo['receiver'] + ")";
        if (messageInfo['receiver'] != current_user){
            return null;
        }
    }
    nameStr = "<img src='/images/member.jpg' alt='avatar' class='align-left'>" 
            + messageInfo['senter'] 
            + "<i class='fa fa-circle private' >" + ielestr + "</i>";
    nameSpan.innerHTML = nameStr;
    

    messageDiv.innerHTML = messageInfo["content"];
    li.appendChild(messageDiv);
    return li;
}
function tryToJoinRoom(user, groupData) {
    let groupName = groupData['name'];
    let truePassword = groupData['password'];

    if(groupData['private'] && !groupData['members'].includes(user)) {
        let guessPassword = prompt("Please enter the password:", "");
        if(truePassword != guessPassword)
        {
            alert("Incorrect password!");
            return;
        }
    }

    let data = {
        'userName': user,
        'groupName': groupName
    }
    socket.emit("join_room", data);
}

function tryToKickMember(user, groupName) {
    let data = {
        'userName': user,
        'groupName': groupName
    }
    socket.emit("kick_member", data);
}

function tryToBanMember(user, groupName) {
    let data = {
        'userName': user,
        'groupName': groupName
    }
    socket.emit("ban_member", data);
}

function tryToQuitRoom(user, groupName) {
    let data = {
        'userName': user,
        'groupName': groupName
    }
    socket.emit("quit_room", data);
}

function sendMessage(private_receiver=null, room_id) {
    console.log(private_receiver);
    const sendInput = document.getElementById("message-to-send");
    console.log(room_id);
    const timeNow = new Date();
    data = {[room_id] : {
            "senter" : socket.userName,
            "time" : new Date().toLocaleString(),
            "content" : sendInput.value,
            "private" : 0,
            "receiver" : ""
        }
    };
    if (private_receiver) {
        data[room_id]['private'] = 1;
        data[room_id]['receiver'] = private_receiver;
    }
    console.log(data);
    socket.emit("message_to_server", data);
    sendInput.value = "";
}