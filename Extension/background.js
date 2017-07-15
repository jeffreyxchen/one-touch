var socket = io('http://localhost:3000');
// Emit identity to server

chrome.tabs.onUpdated.addListener(function(tabId, change, tab){
  // if not already logged in, prompt login
  //else do nothing, allow login
  chrome.tabs.sendMessage(tabId, {}, function(contentResponse){
    // Get the user token or register a new one
    var token;
    chrome.storage.sync.get('token', function(token) {
      if(!token) {
        socket.emit('register_t1')
      } else {
        token = token.token
        var website = null;
        // Get url for the tab
        chrome.tabs.get(tabId, (tab) => {
          website = tab.url;
          socket.emit('login_request_t1', {token: token, website: website});
        })
      }
    })
    console.log(token);

    // Once new user info is stored in mongo, receive the event to register
    // the user by storing the ._id of their mongo object as their token
    // in local chrome storage

    socket.on('registration', function(id){
      chrome.storage.sync.set({token: id})
      console.log(id);
    })


    // Send the request to the backend to login to the site

    // Wait for backend approval to continue login process
    socket.on('login_request_t2', function(obj) {
      chrome.tabs.sendMessage(tabId, {verified: true, username: obj.username, password: obj.password});
    })
    socket.on('new_website', function(obj) {
      chrome.tabs.sendMessage(tabId, {newSite: true});
    })

      // socket.on('request_denied_t2') that reprompts login, mentioning the timeout or other error
  })
})
