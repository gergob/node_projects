
var socket = io.connect();

$(document).ready(function() {
	var chatApp = new Chat(socket);

	socket.on("nameChangeResult", function(result){
		var message;

		if(result.success){
			message = "You are now known as " + result.name + ".";
		}
		else {
			message = result.message;
		}
		
		var textElement = $("<span></span>")
			.addClass("label")
			.addClass("label-success")
			.text(message);
		$("#messages").append(textElement);
	});

	socket.on("joinResult", function(result){
		$("#room").text(result.chat_room);
		var textElement = $("<span></span>")
			.addClass("label")
			.addClass("label-info")
			.text("The chat room has changed to:" + result.chat_room);
		$("#messages").append(textElement);
	});

	socket.on("message", function(result){

		var newMessageElement = $("<div></div>");
		var userElement = $("<p></p>").html($("<b></b>").text("[" + result.from + "]: "));
		var textElement = $("<span></span>").text(result.text);
		$(userElement).append(textElement);
		$(newMessageElement).append(userElement);

		$("#messages").append(newMessageElement);
	});	

	socket.on("chat_rooms", function(rooms){
		$("#room-list").empty();
		for(var idx in rooms) {			
			if(room != "") {
				var chatRoomElement = $("<div></div>")
					.addClass("alert")
					.addClass("alert-info")
					.text(rooms[idx]);
				$("#room-list").append(chatRoomElement);
			}
		}
		$("#room-list div").click(function(){
			chatApp.processUserCommand("/join " + $(this).text());
			$("#send-message").focus();
		});
	});

	setInterval(function(){
		socket.emit("chat_rooms");
	}, 1000);
	
	$("#send-message").focus();

	$("#send-form").submit(function(){
		processInput(chatApp, socket);
		return false;
	});
});


function wrapAndEscape(message) {
	return $("<div></div>").text(message);
}

function wrapAsHtml(message) {
	return $("<div></div>").html("<i>" + message + "</i>");
}

function processInput(chatApp, socket) {
	var message = $("#send-message").val();
	var systemMessage;

	if(message.charAt(0) == '/') {
		systemMessage = chatApp.processUserCommand(message);
		if(systemMessage) {
			$("#messages").append(wrapAsHtml(systemMessage));
		}
	}
	else {
		chatApp.sendMessage($("#room").text(), message);
		$("#messages").append(wrapAndEscape(message));
		$("#messages").scrollTop($("#messages").prop("scrollHeight"));
	}

	$("#send-message").val("");
}