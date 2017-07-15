var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var mongoose = require('mongoose');
var {User} = require('./models.js');

var socketMap = {}; /* token: {'t1': t1, 't2': t2, authorizing: false, timeoutId} */

mongoose.connect("mongodb://onetouch:wedeservetowin@ds135519.mlab.com:35519/one-touch", function() {console.log('connected to mongo');});

io.on('connection', function(socket){
  socket.on('identify', (obj) => {
    if(!socketMap[obj.token]) {
      socketMap[obj.token] = {}
    }
    if(obj.name === 't1'){
      socketMap[obj.token].t1 = socket;
    } else {
      socketMap[obj.token].t2 = socket;
    }
  })
  // Catch identity emission and store in var socketMap
  console.log("inside on connection");
  socket.on('register_t1', function(){
    console.log("inside socket on register_t1");
    registerUser(socket);
  })

  socket.on('check_new_website', (urlObj) => {
    console.log('inside socket on checknew');
    var url = urlObj.url;
    url = url.slice(0, url.indexOf('.com')+5);
    console.log('url', url);

    // find user
    var t1 = socket;
    var token = null;
    Object.keys(socketMap).forEach(function(key){
      if(socketMap[key].t1.id === t1.id){
        token = key;
      }
    })

    // find if logged in
    User.findById(token, function(err, user){
      console.log(token, user);
      if(!user){
        console.log('emitting isnewweb no user');
        socket.emit('is_new_website', {msg: false});
      } else {
        user.websites.forEach(function(websiteObj){
          if(websiteObj.website === url){
            socket.emit('is_new_website', {msg: false});
          } else {
            socket.emit('is_new_website', {msg: true});
          }
        })
      }
    });
  })

  // the user sends in a login request from the web, including a
  // token and a website.
  // then, we validate and
  socket.on('login_request_t1', function(req){
    //console.log('inside loginreqt1', 'req.website', socketMap);
    socketMap[req.token.token] = {t1: socket, authorizing: false};
    User.findById(req.token.token, function(err, user){
      if(!user){
        console.log('Error finding user');
      } else {
        user.websites.forEach(function(websiteObj){
          // console.log('websiteObj website', websiteObj.website, 'req.website', req.website);
          if(websiteObj.website === req.website){
            console.log('/// emitting mobile request', socketMap);
            var t2 = socketMap[req.token.token].t2;
            var phoneData = Object.assign(websiteObj, {token: req.token.token});
            t2.emit('login_request_mobile', phoneData);
          } else {
            console.log('website obj not found');
          }
        })

      }
    })
  })

  socket.on('login_request_t2', function(response){
    // if authorizing is false, emit a request_denied_t2 event to t2
    // emit 'login' to t1 socket with login and password data retrieved from mongo
    console.log('got to login request t2!!!!');
    if(response.mobile_response){
      console.log('emitting login approved t2');
      var t1 = socketMap[response.token].t1;
      t1.emit('login_approved_t2', response.websiteObj);
    } else {
      console.log('Error, fingerprint login error');
    }
  })


  socket.on('create_new_website', function(socket){
    //TODO


  })
});

function registerUser(socket){
  console.log('in registerUser beginning');
  var usr = new User();
  usr.save(function(err, user){
    if(err){
      console.log('Error saving new user', err);
    } else {
      console.log('emitting registration inside registerUser', socketMap);
      socket.emit('registration', {id: user._id});
    }
  })
}

server.listen(3000, '0.0.0.0', () => {
  console.log('Server listening on port 3000!');
});
