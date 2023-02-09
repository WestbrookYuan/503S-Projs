/************************* data *************************/

// username and password
// var users = {
//     "Hive" : {
//         "socket_id" : "???",
//         "password" : "123",
//         "joined_rooms" : [],
//         "banned_rooms" : []
//     },
//     "Hive2" : {
//         "socket_id" : "???",
//         "password" : "456",
//         "joined_rooms" : [],
//         "banned_rooms" : []
//     }
// };
var users = {};

// rooms
var rooms = {
    "testRoom1": {
        "name" : "testRoom1", // name of the room
        "creator" : "Hive4", // owner of the room
        "private" : 0, // 0: no password, 1: with password
        "password" : "666", // only be used when private is 1
        "members" : [],  // list of users who are currently in this room
        "banned_list" : {
            "Hive2" : "2022-11-17 12:00:00",
            "Hive3" : "2022-11-17 12:00:00",
            "syb" : "2025-11-17 12:00:00"
        }
    }
};

var messages = {
    "testRoom1" : [
        {
        "senter" : "Hive", // who sent the message
        "time" : "2022-11-17 12:00:00",
        "content" : "test public",
        "private" : 0, // 0: public message, 1: private message
        "receiver" : "" // valid if private is 1
        },
        {
            "senter" : "Hive", // who sent the message
            "time" : "2022-11-17 12:00:00",
            "content" : "test private",
            "private" : 1, // 0: public message, 1: private message
            "receiver" : "syb" // valid if private is 1
        },
        {
            "senter" : "syb", // who sent the message
            "time" : "2022-11-17 12:00:00",
            "content" : "test private2",
            "private" : 1, // 0: public message, 1: private message
            "receiver" : "Hive" // valid if private is 1
        }
    ]
};


/************************* scripts *************************/
const http = require('http'),
	url = require('url'),
	path = require('path'),
	mime = require('mime'),
	fs = require('fs');

const port = 3456;
const file = "client.html";

const server = http.createServer(function(req, resp){
    var filename = path.join(__dirname, "static", url.parse(req.url).pathname);
	(fs.exists || path.exists)(filename, function(exists){
		if (exists) {
			fs.readFile(filename, function(err, data){
				if (err) {
					// File exists but is not readable (permissions issue?)
					resp.writeHead(500, {
						"Content-Type": "text/plain"
					});
					resp.write("Internal server error: could not read file");
					resp.end();
					return;
				}
				
				// File exists and is readable
				var mimetype = mime.getType(filename);
				resp.writeHead(200, {
					"Content-Type": mimetype
				});
				resp.write(data);
				resp.end();
				return;
			});
		}else{
			// File does not exist
			resp.writeHead(404, {
				"Content-Type": "text/plain"
			});
			resp.write("Requested file not found: "+filename);
			resp.end();
			return;
		}
	});
});

server.listen(port);

const socketio = require("socket.io")(http, {
    wsEngine: "ws"
});

const io = socketio.listen(server);
io.sockets.on("connection", function(socket){
    // called when a new Socket.IO connection is established
    socket.on("login", function(data) {
        res = login(data, socket.id);
        if(res["result"]){
            return_data = {
                "success" : true,
                "currentId" : res["currentId"],
                "currentUser" : res["currentUser"],
                "message" : res["message"],
                "users_list" : users,
                "rooms" : rooms
            }; 
            io.sockets.to(socket.id).emit("login_feedback", return_data);
        }
        else{
            return_data = {
                "success" : false,
                "message" : res["message"],
                "users_list" : {},
                "rooms" : {}
            }; 
            io.sockets.to(socket.id).emit("login_feedback", return_data);
        }
        
    })
    // TODO: callback when creating room
    socket.on('create_room', function(data){
        res = createGroup(data);
        if(res["result"]){
            return_data = {
                "message" : res["message"],
                // "users_list" : users, // why need this?
                "rooms" : rooms
            }; 
            io.sockets.emit("create_room_feedback", return_data);
        }
        else{
            return_data = {
                "message" : res["message"],
                "users_list" : {},
                "rooms" : rooms
            }; 
            io.sockets.emit("create_room_feedback", return_data);
        }
    });

    // TODO: callback when joining room
    socket.on('join_room', function(data){
        res = joinGroup(data);
        let return_data;
        if(res["result"]){
            return_data = {
                "message" : res["message"],
                "users_list" : users,
                "rooms" : rooms,
                "cur_room": data['groupName']
            }; 
            socket.join(data['groupName']);
            // refresh the joiner's member list
            io.sockets.to(socket.id).emit("join_room_feedback", return_data);
            // refresh the memebrList of the group on all other members' page
            io.sockets.to(data['groupName']).emit("new_member_to_room", return_data);
        }
        else{
            if(res['isExisted']){
                socket.join(data['groupName']);
                return_data = {
                    "message" : res["message"],
                    "users_list" : {},
                    "rooms" : rooms,
                    "cur_room": data['groupName']
                }; 
            }else{
                return_data = {
                    "message" : res["message"],
                    "users_list" : {},
                    "rooms" : rooms,
                    "cur_room": null
                }; 
            }
            
            io.sockets.to(socket.id).emit("join_room_feedback", return_data);
        }
    });

    // TODO: callback when a new user use connect to the server
    socket.on('load_my_rooms', function(data){

    });

    // TODO: callback when a new message is sent to some room
    socket.on('message_to_server', function(data){
        // get room_id from data
        if (processMessage(data)) {
            io.sockets.to(socket.id).emit("message_to_client", messages);
            io.sockets.to(Object.keys(data)[0]).emit("message_to_client", messages);
        }

        // io.sockets.emit("message_to_client", { message: data["message"] }); // broadcast
    })

    // TODO: callback when a private message is sent to someone in room
    socket.on('private_message_to_server', function(data){

    })

    // TODO: kick member from the room
    socket.on('kick_member', function(data){
        kickMember(data);
    })

    socket.on('leave', function(data){
        socket.leave(data['cur_room']);
    })

    // TODO: ban someone from the room
    socket.on('ban_member', function(data){
        // add username to banned_list
        let banned_user = data['userName'];
        let theRoom = data['groupName'];
        let cur_date = new Date();
        let year = cur_date.getFullYear() + 500;
        let month = cur_date.getMonth();
        let day = cur_date.getDate();
        let free_date = new Date(year, month, day);
        let free_date_str = free_date.toLocaleString([], { hour12: false });
        rooms[theRoom]['banned_list'][banned_user] = free_date_str;
        // kick user out of the room
        kickMember(data);
    })

    // TODO: quit room
    socket.on('quit_room', function(data){
        quitRoom(data);
        // socket.leave(data['groupName']);
    })
});

function login(data, socket_id){
    if(data != null){
        var input_user = data.user;
        var input_pwd = data.pwd;
        if (users[input_user] != undefined) {
            if (users[input_user]["password"] == input_pwd) {
                return {"result": true, "message": "welcome " + input_user, "currentUser" : input_user, "currentId": socket_id};
            } 
            else {
                return {"result": false, "message": "incorrect password"};
            }
        }
        else{
            users[input_user] = {"socket_id" : socket_id, 
                                "password" : input_pwd, 
                                "joined_rooms": [], 
                                "banned_rooms": []};
            return {"result": true, "message": "welcome " + input_user, "currentUser" : input_user, "currentId": socket_id};
        }
    }
    else{
        return {"result": false, "message": "invalid input"};
    }
}

function createGroup(data) {
    if (rooms[data["name"]] == undefined) {
        rooms[data["name"]] = data;
        return {"result" : true, "message":"room created"};
    }
    else{
        return {"result" : false, "message":"room already existed"};
    }
}

function joinGroup(data) {
    let user = data['userName'];
    let groupName = data['groupName'];
    if (rooms[groupName]["members"].includes(user)) {
        return {"result": false, "isExisted": true, "message": "you are already in the room!"};
    }
    else{
        if (rooms[groupName]["banned_list"][user] != undefined) {
            var currenTime = new Date();
            var banTime = new Date(rooms[groupName]["banned_list"][user]);
            if (currenTime > banTime)
            {
                rooms[room_id]["members"].push(user);
                delete rooms[groupName]["banned_list"][user];
                return {"result": true, "isExisted": true, "message": "you joined"};
            }
            else
            {
                return {"result": false, "isExisted": false, "message": "you are banned from this room!"};
            }
        }
        else{
            rooms[groupName]["members"].push(user);
            return {"result": true, "isExisted": false, "message": "Successfully joined the room!"};
        }
    }
}

function kickMember(data) {
    let kicked_user = data['userName'];
    let theRoom = data['groupName'];
    let memberList = rooms[theRoom]['members'];
    for (let i = 0; i < memberList.length; i++) {
        if (memberList[i] === kicked_user) {
            memberList.splice(i, 1);
            break;
        }
    }

    return_data = {
        "rooms" : rooms,
        "cur_room": theRoom
    }; 

    let kicked_socketID = users[kicked_user]['socket_id'];
    // hide memberList of this group on the kicked user's page
    io.sockets.to(kicked_socketID).emit("got_kicked", return_data);
    // refresh the memebrList of the group on all other members' page
    io.sockets.to(theRoom).emit("new_member_to_room", return_data);
}

function quitRoom(data) {
    let quit_user = data['userName'];
    let theRoom = data['groupName'];
    let memberList = rooms[theRoom]['members'];
    for (let i = 0; i < memberList.length; i++) {
        if (memberList[i] === quit_user) {
            memberList.splice(i, 1);
            break;
        }
    }

    // if room is empty now???

    return_data = {
        "rooms" : rooms,
        "cur_room": theRoom
    };

    let quit_socketID = users[quit_user]['socket_id'];
    // hide memberList of this group on the quited user's page
    io.sockets.to(quit_socketID).emit("got_quit", return_data);
    // refresh the memebrList of the group on all other members' page
    io.sockets.to(theRoom).emit("new_member_to_room", return_data);
    
}

function processMessage(data) {
    if (data != {}) {
        let room_id = Object.keys(data)[0];
        let messageInfo = data[room_id];
        if (messages[room_id] == undefined){
            messages[room_id] = [];
    }
    messages[room_id].push(messageInfo);
    }
    return true;  
}