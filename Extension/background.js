var socket = io('localhost:3000');

chrome.tabs.onUpdated.addListener(function(tabId, change, tab){
  // if not already logged in, prompt login
  //else do nothing, allow login
  chrome.tabs.sendMessage(tabId, {}, function(obj){
    var website = null;
    // TODO: if token does not exist, prompt registration and create new token
    // TODO: create new token by prompting for a phone number.
    // TODO: store the gmail/password/phone number object in mongo, store the ._id using StorageArea.set({token: ._id})
    var token = 1;

    // Get current url *async*
    chrome.tabs.get(tabId, function(tab){
      website = tab.url;
    })
    .then(
      // Send the request to the backend
      socket.emit('login_request', {token: token, website: website})
      // Wait for backend approval to continue login process
      socket.on('accept', function(obj) {
        chrome.tabs.sendMessage(tabId, {username: obj.username, password: obj.password});
      })
    )
  })
})
