console.log('Server started...');
var config   = require('./config.js');
var http     = require('http');
var url      = require('url');
var fs       = require('fs');
var mysql    = require('mysql');

//create server connection
var server = http.createServer(handler);
var io = require('socket.io')(server);
server.listen(1000);


var connection = mysql.createConnection({
    host     : config.db.host,
    user     : config.db.user,
    password : config.db.password,
    database : config.db.database
});

connection.connect(function(err) {
    if(err){
       console.log(err);
    }
});


//var everyone = nowjs.initialize(server);
/**
 * server create : handler
 * @param request
 * @param response
 */
function handler(request, response) {
    response.writeHead(200);
    $url = url.parse(request.url);
    if($url.path == '/') $file = 'public/index.html';
    else {
        $file = 'public'+ $url.href;
    } //TODO

    //FIXME: security problems
    fs.readFile($file, function(err, contents) {
        if (err) {
            response.writeHead(500);
            return response.end('Error loading index.html');
        }

        response.write(contents);
        response.end();
    });
}

/**
 * define an event or listener
 */
io.on('connection', function (socket) {
    var mobiles = require('./data/mobiles.js');

    socket.emit('mobiles',mobiles.data);

    socket.on('mobiles:isready', function (data) {
        var query = connection.query('SELECT * FROM `site_session_data` ? LIMIT 1', {/*conditions*/}, function(err, result) {
            console.log(result)
        });
        console.log(query.sql);
        console.log(data);
    });
});


console.log('server running successfully!');