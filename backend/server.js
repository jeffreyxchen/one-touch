var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var mongoose = require('mongoose');
var {User} = require('./models.js');

var socketMap = {}; /* token: {'t1': t1, 't2': t2, authorizing: false, timeoutId} */

mongoose.connect("mongodb://onetouch:wedeservetowin@ds135519.mlab.com:35519/one-touch", function() {console.log('connected to mongo');});

io.on('connection', function(socket){
  // Catch identity emission and store in var socketMap
  socket.on('register_t1', function(){
    registerUser(socket);
  })

  // the user sends in a login request from the web, including a
  // token and a website.
  // then, we validate and
  socket.on('login_request_t1', function(req){
    console.log('req', req);
    User.findById(req.token, function(err, user){
      if(!user){
        // The user doesn't exist, register them!
        registerUser(socket);
      } else {
        var token = user._id;
        var t1 = socket.id;
        var t2 = socketMap.token.t1;
        user.websites.forEach(function(websiteObj){
          if(websiteObj.website === req.website){

          } else {
            socket.emit('new_website', {website: req.website})
          }
        })
      }
    })
    // go to database, check if token id exists
    //          check if website login/password exists
    //              if token id does not exist, prompt registration socket.emit back to background.js
    //              if website login/password does not exist, prompt enter login/password for this website (later integrate google/fb oauth)
    // emit 'login_request' to partner socket based of socketMap (req has the token)
    // set authorizing to true, store setTimeout for 30 seconds. Set authorizing to false at end of timeout (in callback)
  })
//
//   socket.on('request_approved_t2', function(req){
//     // if authorizing is false, emit a request_denied_t2 event to t2
//     // emit 'login' to t1 socket with login and password data retrieved from mongo
//   })
// });

  function registerUser(socket){
    var usr = new User();
    usr.save(function(err, user){
      if(err){
        console.log('Error saving new user', err);
      } else {
        // TODO: update socketMap
        // TODO: still need to find t2 and time
        socketMap[user._id] = {t1: socket.id, authorizing: false};
        socket.emit('registration', user._id);
      }
    })
  }
})

server.listen(3000, '0.0.0.0', () => {
  console.log('Server listening on port 3000!');
});
