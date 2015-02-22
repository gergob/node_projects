var socketio = require("socket.io");
var io;
var userCounter = 1;
var userNames = {};
var usedUserNames = [];
var currentChatRoom = {};

exports.listenForUsers = function(server) {

	io = socketio.listen(server);
	io.set('log level', 1);

	io.sockets.on('connection', function(socket){
		userCounter = assignUserName(socket, userCounter, userNames, usedUserNames);

		joinChatRoom(socket, 'Launge');

		handleMessageBroadcast(socket, userNames);

		handleNameChangingRequests(socket, userNames, usedUserNames);

		handleChatRoomJoining(socket);

		socket.on('chat_rooms', function(){
			socket.emit('chat_rooms', io.socket.managers.chat_rooms);
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
		socket.broadcast.to(message.room).emit("message",{
			text: userNames[socket.id] + ": " + message.text
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
		socket.leave(currentChatRoom[socket.id]);
		handleChatRoomJoining(socket, room.newChatRoom);
	});
}

function handleChatRoomJoining(socket, chat_room) {
	socket.join(chat_room);
	currentChatRoom[socket.id] = chat_room;
	socket.emit("joinResult",{
		chat_room : chat_room
	});
	socket.broadcast.to(chat_room).emit("message", {
		text: usedUserNames[socket.id] + " has joined " + chat_room + "."
	});

	var usersInChatRoom = io.sockets.clients(chat_room);
	if(usersInChatRoom.length > 1) {
		var usersInRoomText = "Users currently in " + chat_room + ":";
		for(var idx in usersInChatRoom) {
			var userSocketId = usersInChatRoom[idx].id;
			if(userSocketId != socket.id) {
				if(idx > 0) {
					usersInRoomText += ", ";
				}
				usersInRoomText += usedUserNames[userSocketId];
			}
		}
		usersInRoomText += ".";
		socket.emit("message", {text: usersInRoomText});

	}

}

function handleNameChangingRequests(socket, userNames, usedUserNames){
	socket.on("nameChange", function(name){
		if(name.indexOf("User") == 0) {
			socket.emit("nameChangeResult", {
				success: false,
				message: "Names cannot start with User."
			});
		} 
		else{
			if(usedUserNames.indexOf(name) == -1) {
				var prevName = userNames[socket.id];
				var prevNameIndex = usedUserNames.indexOf(prevName);
				usedUserNames.push(name);
				userNames[socket.id] = name;
				delete usedUserNames[prevNameIndex];
				socket.emit("nameChangeResult", {
					success: true,
					name: name
				});
				socket.broadcast.to(currentChatRoom[socket.id]).emit("message", {
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