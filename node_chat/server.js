var http = require("http");
var fs = require("fs");
var path = require("path");
var mime = require("mime");
var local_cache = {};
var chat_server = require('./lib/chat_server');

function sendPageNotFound(response) {
	response.writeHead(404, {"Content-Type" : "text/plain"});
	response.write("Page Not Found!");
	response.end();
}

function sendFile(response, filePath, content) {
	response.writeHead(200, 
		{"Content-Type" : mime.lookup(path.basename(filePath))}
	);
	response.end(content);
}

function sendStaticFile(response, cache, path) {
	if(cache[path]) {
		sendFile(response, path, cache[path]);
	}
	else {
		fs.exists(path, function(exists){
			if(exists) {
				fs.readFile(path, function(error, content){
					if(error) {
						console.log(error);
						sendPageNotFound(response);
					}
					else {
						cache[path] = content;
						sendFile(response, path, content);
					}
				});
			}
			else {
				console.log("File at:" + path + " not found.");
				sendPageNotFound(response);
			}
		});
	}
}

var server = http.createServer(function(request, response){
	var filePath = false;

	if(request.url == "/") {
		filePath = "public/index.html";
	}
	else {
		filePath = "public" + request.url;
	}

	var fullPath = './' + filePath;
	sendStaticFile(response, local_cache, fullPath);

});

server.listen(8989, function() {
	console.log("Started node_chat, listening on port 8989.");
});