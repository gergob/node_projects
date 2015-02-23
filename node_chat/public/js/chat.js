
var Chat = function(socket) {

	this.socket = socket;

};

Chat.prototype.sendMessage = function(room,text) {
	var message = {
		room:room,
		text:text
	};
	this.socket.emit("message", message);
};

Chat.prototype.changeChatRoom = function(room){
	this.socket.emit("join", {
		newChatRoom : room
	});
};

Chat.prototype.processUserCommand = function(command) {
	var words = command.split(" ");
	var command = words[0].substring(1,words[0].length).toLowerCase();

	var message = false;

	switch(command) {
		case "join":
			words.shift();
			var room = words.join(" ");
			console.log("Requesting room change to " + room);
			this.changeChatRoom(room);
			break;
		case "nick" : 
			words.shift();
			var newName = words.join(" ");
			console.log("Requesting name change to " + newName);
			this.socket.emit("nameChange", newName);
			break;
		default:
			message = "Cannot handle command " + command;
			break;
	}
	
	return message;
};
