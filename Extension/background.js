var socket = io('http://localhost:3000');
// Emit identity to server
// socket.emit('')

chrome.tabs.onUpdated.addListener(function(tabId, change, tab){
  // if not already logged in, prompt login
  //else do nothing, allow login
  chrome.tabs.sendMessage(tabId, {}, function(contentResponse){
    var website = null;

    // Check local store and only emit when token DNE

    socket.emit('register_t1')

    // Once new user info is stored in mongo, receive the event to register
    // the user by storing the ._id of their mongo object as their token
    // in local chrome storage
    var token;
    socket.on('registration', function(id){
      token = id;
    })
    
    // Get url for the tab
    chrome.tabs.get(tabId, function(tab){
      website = tab.url;
    })
    // Send the request to the backend to login to the site
    socket.emit('login_request_t1', {token: token, website: website})
    // Wait for backend approval to continue login process
    //
    socket.on('login_request_t2', function(obj) {
      chrome.tabs.sendMessage(tabId, {username: obj.username, password: obj.password});
    })
    socket.on('new_website', function(obj) {
      chrome.tabs.sendMessage(tabId, {newSite: true});
    })

      // socket.on('request_denied_t2') that reprompts login, mentioning the timeout or other error
  })
})
