
var http = require("http");

var SEPARATOR =   "---------------------------------------";
var NEW_REQUEST = "              NEW REQUEST";

var echo_server = http.createServer(function(request, response){
	console.log(SEPARATOR);
	console.log(NEW_REQUEST)
	console.log(SEPARATOR);
	console.log("HTTP Version:" + request.httpVersion);

	console.log("HEADERS: User Agent: " + request.headers["user-agent"]);
	
	//
	// Since the request and response are streams,
	// We can pipe the request into the response stream
	// With this creating an echo server
	//
	request.pipe(response);
	
});

echo_server.listen(13333);