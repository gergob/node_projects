
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

	//TODO finish
	return message;

};