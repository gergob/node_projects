var socketio = require("socket.io");
var io;
var userCounter = 1;
var userNames = {};
var usedUserNames = [];
var currentChatRoom = {};
var chat_rooms = [];

exports.listenForUsers = function(server) {

	console.log("socket io is listening for users.");
	io = socketio.listen(server);
	
	io.sockets.on('connection', function(socket){
		userCounter = assignUserName(socket, userCounter, userNames, usedUserNames);

		handleChatRoomJoining(socket, 'Launge');

		handleMessageBroadcast(socket, userNames);

		handleNameChangingRequests(socket, userNames, usedUserNames);

		handleChatRoomJoiningRequest(socket);

		socket.on('chat_rooms', function(){
			socket.emit('chat_rooms', chat_rooms);
		});
	});
};

function handleClientDisconnect(socket) {
	socket.on("disconnect", function() {
		var nameIndex = usedUserNames.indexOf(userNames[socket.id]);
		if(nameIndex != -1) {
			delete userNames[socket.id];
			delete usedUserNames[nameIndex];
		}
	});
}

function handleMessageBroadcast(socket, userNames) {
	socket.on("message", function(message){
		console.log("Recieved message: [" + userNames[socket.id] + ":"  + message.text + "]");
		socket.broadcast.to(message.room).emit("message",{
			from: userNames[socket.id],
			text:  message.text
		});
	});
}

function assignUserName(socket, userCounter, userNames, usedUserNames){
	var name = "User" + userCounter;
	userNames[socket.id] = name;
	socket.emit('nameResult', {
		success: true,
		name : name
	});

	usedUserNames.push(name);
	return userCounter + 1;
}



function handleChatRoomJoiningRequest(socket) {
	socket.on("join", function(room){
		console.log("Request to join chat room:" + room.newChatRoom);
		socket.leave(currentChatRoom[socket.id]);
		handleChatRoomJoining(socket, room.newChatRoom);
	});
}

function handleChatRoomJoining(socket, chat_room) {
	socket.join(chat_room);
	currentChatRoom[socket.id] = chat_room;
	console.log("Changing chat room to " + chat_room);

	socket.emit("joinResult",{
		chat_room : chat_room
	});

	console.log("Emitted join result.");
	console.log("Broadcasting that user has joined chat room: " + chat_room);
	socket.broadcast.to(chat_room).emit("message", {
		from: "System",
		text: userNames[socket.id] + "has joined " + chat_room + "."
	});
	
	updateChatRooms(chat_room);
	
	var usersInChatRoom = [];	
	for(var sock_id in currentChatRoom) {
		if(currentChatRoom[sock_id] == chat_room) {
			usersInChatRoom.push(sock_id);
		}
	}

	console.log("There are "+ usersInChatRoom.length + " users in chat room: " + chat_room );
	if(usersInChatRoom.length > 0) {
		var usersInRoomText = "Users currently in [" + chat_room + "]: ";
		for(var idx in usersInChatRoom) {
			var userSocketId = usersInChatRoom[idx];
			if(userSocketId != socket.id) {
				if(idx > 0) {
					usersInRoomText += ", ";
				}
				usersInRoomText += userNames[userSocketId];
			}
		}
		
		console.log("Emitting message:" + usersInRoomText);
		socket.emit("message", {
			from: "System",
			text: usersInRoomText
		});
	}
}

function updateChatRooms(newRoom) {
	if(chat_rooms) {
		var found = false;
		for(var idx in chat_rooms) {
			if(chat_rooms[idx] == newRoom) {
				found = true;
				break;
			}
		}
		if(!found) {
			chat_rooms.push(newRoom);
		}
	}
}

function handleNameChangingRequests(socket, userNames, usedUserNames){
	socket.on("nameChange", function(name){
		console.log("Request for name change to:" + name);
		if(name.indexOf("User") == 0) {
			socket.emit("nameChangeResult", {
				success: false,
				message: "Names cannot start with User."
			});
			console.log("User name changed faile, because new user name cannot start with User text.");
		} 
		else{
			if(usedUserNames.indexOf(name) == -1) {
				var prevName = userNames[socket.id];
				var prevNameIndex = usedUserNames.indexOf(prevName);
				usedUserNames.push(name);
				userNames[socket.id] = name;
				delete usedUserNames[prevNameIndex];
				console.log("Name change was successful, notifying clients.");
				socket.emit("nameChangeResult", {
					success: true,
					name: name
				});
				socket.broadcast.to(currentChatRoom[socket.id]).emit("message", {
					from: "System",
					text: prevName + " is now known as " + name + "."
				});
			}
			else {
				socket.emit("nameChangeResult", {
					success: false,
					message: "The name is already taken."
				});
			}
		}
	});
}