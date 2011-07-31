/*
	INSTRUCTIONS
	
	
	
	shell: cd /home/instavis/public_html/
	shell: node instavision.js
	shell: kill ##### (process number)
	
	call the url: http://instavision.tv:8080/feed.html
	
	Needs: 	
			find out rate limit with instagram = 5000 requests per hour
*/
var sys = require("sys"),  
    http = require("http"),
    https = require("https"),  
    url = require("url"),  
    path = require("path"),  
    fs = require("fs"), 
    util = require("util"),  
    events = require("events");  
  
function load_static_file(uri, response) {  
    var filename = path.join(process.cwd(), uri);  
    path.exists(filename, function(exists) {  
        if(!exists) {  
            response.writeHead(404, {"Content-Type": "text/plain"});  
            response.write("404 Not Found\n" + " filename: " + filename);  
            response.end();  
            return;  
        }  
  
        fs.readFile(filename, "binary", function(err, file) {  
            if(err) {  
                response.writeHead(500, {"Content-Type": "text/plain"});  
                response.write(err + "\n");  
                response.end();  
                return;  
            }  
  
            response.writeHead(200);  
            response.write(file, "binary");  
            response.end();  
        });  
    });
}

//var twitter_client = http.createClient(80, "api.instagram.com");  
  
var tweet_emitter = new events.EventEmitter();  
  
function get_tweets() {  
    //var request = twitter_client.request("GET", "/v1/tags/bdwinstavision/media/recent?access_token=3036112.f59def8.4708bbe9fe9e43639c8d9fe93c5c41df", {"host": "api.instagram.com"}); 
    
    
    
    var options = {
    // public search - unauthenticated
	//host: 'api.instagram.com',
	//path: '/v1/tags/bdwinstavision/media/recent?access_token=3036112.f59def8.4708bbe9fe9e43639c8d9fe93c5c41df',
	
	// authenticated feed - https://api.instagram.com/v1/users/self/feed?access_token=3036112.c90c34d.411d18988857490c9032a2bac30e6943
	
	// instavisionTV access token
	// access_token = 3036112.c90c34d.411d18988857490c9032a2bac30e6943
	
	// instavision access token
	// access_token = 3060511.0b03a1e.fff65e339b694cf0844306131ab82b97
	host: 'api.instagram.com',
	path: '/v1/users/self/feed?access_token=3060511.0b03a1e.fff65e339b694cf0844306131ab82b97',
    } 
    
    https.get(options, function (res) {
		var raw = "";
		res.on('data', function (chunk) {
		    raw += chunk;
		});
		res.on('end', function () {
		    var response = JSON.parse(raw);
		    
		   //sys.puts(response); 
	
		    if(raw.length > 0) {  
	/*         	sys.puts("tweets:" + response);  */
	            tweet_emitter.emit("tweets", response);  
	        }
	        //res.removeListener('connection', callback);
		});
    }).on('unhandledException', function(e) {
	  // console.error(e);
	  // open file to write errors to append look fs.open
	  
	  /*
	  	var file = new node.fs.File();
		file.open("/var/log", "w+");
		file.write("hello");
		file.write("world");
		file.close();
	  */
	  
	  sys.puts(e);
	});
  
    /*request.addListener("response", function(response) {  
        var body = "";  
        response.addListener("data", function(data) {  
            body += data; 
            sys.puts("tweets:" + data); 
        });  
  
        response.addListener("end", function() {  
            var tweets = JSON.parse(body); 
            sys.puts(body); 
            if(tweets.length > 0) {  
            	//sys.puts("tweets:" + tweets); 
                tweet_emitter.emit("tweets", tweets);  
            }  
        });  
    }); */ 
  
    //request.end();  
}
  
setInterval(get_tweets, 5000);

http.createServer(function(request, response) {  
    var uri = url.parse(request.url).pathname;
    //var uri = request.url;
    
    var callback = function(stream) {
	  sys.puts('listener removed!');
	};
      
    if(uri === "/stream") {  
  
        //var listener = tweet_emitter.addListener("tweets", function(tweets) {
        var listener = tweet_emitter.on("tweets", function(tweets) {  
            response.writeHead(200, { "Content-Type" : "text/plain" });
             
            response.write(JSON.stringify(tweets));
            
            //sys.puts("stringify tweets:" + JSON.stringify(tweets));
              
            response.end();
              
            //var listenersForTeets = tweet_emitter.listeners(listener);
        
        	//sys.puts(util.inspect(listener));
        	
        	
        	
        	//tweet_emitter.removeListener(tweets);
        	//tweet_emitter.removeListener(tweet_emitter);
        	//tweet_emitter.removeListener(listener);
        	//tweet_emitter.removeListener("tweets");
  			//tweet_emitter.removeListener("listener");
  			//tweet_emitter.removeListener("tweet_emitter");
  			if(listener) {
  				//sys.puts("removed listeners for tweets: " + util.inspect(listener, true, null));
/*   				sys.puts("cleared listener 1: " + listener.length); */
  				listener.removeAllListeners("tweets");
  				
  			}
  			
  			if(timeout) {
  				//sys.puts("cleared timeout " + util.inspect(timeout, true, null));
/*   				sys.puts("cleared timeout"); */
  				clearTimeout(timeout);
  			}
              
            
        });
        
        //tweet_emitter.removeListener(tweets);
        
        //sys.puts(util.inspect(tweet_emitter.listeners(listener), true, null));
          
  
        var timeout = setTimeout(function() {  
            response.writeHead(200, { "Content-Type" : "text/plain" });  
            response.write(JSON.stringify([])); 
             
            response.end();  
  			if(listener) {
  				//tweet_emitter.removeListener(listener);
  				//sys.puts("removed 2nd listeners for tweets: " + util.inspect(listener, true, null));
/*   				sys.puts("removed 2nd listeners for tweets: "); */
  				listener.removeAllListeners("tweets");
  			}
        }, 10000); 
        
         
  
    } else {  
        load_static_file(uri, response);  
    }  
}).listen(8080);  
  
sys.puts("Server running at http://instavision.com:8080/");
