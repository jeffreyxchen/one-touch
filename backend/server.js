var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var mongoose = require('mongoose')

io.on('connection', function(socket){
  console.log('socket connected', socket);
});

mongoose.connect("mongodb://onetouch:wedeservetowin@ds135519.mlab.com:35519/one-touch");

io.on('login_request', function(socket){
  console.log('worked');
})


app.listen(3000, '0.0.0.0', () => {
  console.log('Server listening on port 3000!');
})
