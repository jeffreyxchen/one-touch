var socket = io('http://localhost:3000');
// Get the user token or register a new one
var token;
chrome.storage.sync.get('token', function(tok) {
  console.log('HERE HER EHERE ');
  if(!tok.token) {
    console.log('registering new user');
    socket.emit('register_t1')
  } else {
    token = tok
    socket.emit('identify', {token: token, name: 't1'})
  }
})


socket.on('registration', function(obj){
  chrome.storage.sync.set({token: obj.id})
  console.log(obj.id);
})
console.log('token',token);

chrome.tabs.onUpdated.addListener(function(tabId, change, tab){
    var website = null;
    // Get url for the tab
    chrome.tabs.get(tabId, function(tab){
      website = tab.url;
      console.log(website);
      // Check if we need to register this website to the user
      socket.emit('identify', {token: '5969debd071d8f0897923dbd', name: 't1'})
      socket.emit('check_new_website', {url: website})
      socket.on('is_new_website', function(obj) {
        console.log('checking website', 'response', obj);
        if(obj.msg) {
          chrome.tabs.sendMessage(tabId, {newSite: true});
        } else {
          // Send the request to the backend to login to the site
          socket.emit('login_request_t1', {token: token, website: website})
          console.log('requested login', ' awaiting t2');
          // Wait for backend approval to unlock and continue login process
          socket.on('login_approved_t2', function(credentials) {
            console.log('received response t2', credentials);
            chrome.tabs.sendMessage(tabId, {verified: true, username: credentials.username, password: credentials.password});
          })
        }
      })
    })
  })
