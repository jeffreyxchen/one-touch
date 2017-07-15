var socket = io('http://localhost:3000');
// Emit identity to server
// socket.emit('')

chrome.tabs.onUpdated.addListener(function(tabId, change, tab){
  // if not already logged in, prompt login
  //else do nothing, allow login
  chrome.tabs.sendMessage(tabId, {}, function(obj){
    var website = null;

    // Check local store and only emit when token DNE
    StorageArea.get(token, function(obj){
      console.log('getting token!', obj);
      socket.emit('register_t1')
    });

    // Once new user info is stored in mongo, receive the event to register
    // the user by storing the ._id of their mongo object as their token
    // in local chrome storage
    socket.on('registration', function(id){
      StorageArea.set({token: id}, function(err){
        console.log('successfully registered!');
      });
    })

    //TODO: temporary, will not need after mongo is implemented
    var token = 33454;

    // Get current url *async*
    chrome.tabs.get(tabId, function(tab){
      website = tab.url;
    })

    // Send the login request to the backend
    socket.emit('login_request_t1', {token: token, website: website})

    // Wait for backend approval to continue login process
    socket.on('login_request_t2', function(obj) {
      chrome.tabs.sendMessage(tabId, {username: obj.username, password: obj.password});
    })

    // socket.on('request_denied_t2') that reprompts login, mentioning the timeout or other error
  })
})
