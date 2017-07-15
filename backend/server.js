var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var mongoose = require('mongoose');

var socketMap = {}; /* token: {t1: t2, t2: t1, authorizing: false, timeoutId} */

mongoose.connect("mongodb://onetouch:wedeservetowin@ds135519.mlab.com:35519/one-touch", function() {console.log('connected to mongo');});

io.on('connection', function(socket){
  console.log("New socket connected!", socket.id);
  // Catch identity emission and store in var socketMap
  socket.on('register_t1', function(emailObj){
    console.log();
  })

  // emit login_request with token and website object
  // they check for fingerprint and send back

  socket.on('login_request_t1', function(req){
    if(req.website){
      console.log(req);
    }
    // go to database, check if token id exists
    //          check if website login/password exists
    //              if token id does not exist, prompt registration socket.emit back to background.js
    //              if website login/password does not exist, prompt enter login/password for this website (later integrate google/fb oauth)
    // emit 'login_request' to partner socket based of socketMap (req has the token)
    // set authorizing to true, store setTimeout for 30 seconds. Set authorizing to false at end of timeout (in callback)
  })

  socket.on('request_approved_t2', function(req){
    // if authorizing is false, emit a request_denied_t2 event to t2
    // emit 'login' to t1 socket with login and password data retrieved from mongo
  })
});








server.listen(3000, '0.0.0.0', () => {
  console.log('Server listening on port 3000!');
})
