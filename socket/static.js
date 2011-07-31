/***************************  Require modules  ********************************/
var sys = require('sys'),
        http = require('http'),
        path = require('path'),
        url = require('url'),
        fs = require('fs');

/*************************  Start static server  ******************************/
                server = http.createServer(function(request, response) {
                    var uri = url.parse(request.url).pathname;
                    // prefix with httpdocs/ (or whatever you want) if you want to store your static files in a separate folder
                    var filename = path.join(process.cwd(), "../" + uri);
                        path.exists(filename, function(exists) {
                                
                                sys.puts(filename);
                                
                                // Rewrite URL if necessary - just some basic rewrite rules
                                if (uri.charAt(uri.length -1) === '/') {
                                                filename += 'index.html';
                                        } else if(uri.indexOf('.') === -1) {
                                                filename += '/index.html';
                                        }
                                
                                if(!exists) {
                                        response.writeHead(404, {"Content-Type": "text/plain"});
                                        response.end("404 Not found\n");
                                        return;
                                        }
                                else {
                                        fs.readFile(filename, "binary", function(err, file) {
                                                if(err) {
                                                        response.writeHead(403, {"Content-Type": "text/plain"});
                                                        response.end(err +"\n");
                                                        return;
                                                }
          
                                                response.writeHead(200);
                                                response.end(file, "binary");
                                        });     
                                }
                        });
                });
                
                server.listen(8000);
                sys.puts('Static file server listening to port ' + 8000);
                
