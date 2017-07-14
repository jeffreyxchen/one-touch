

chrome.tabs.onUpdated.addListener(function(tabId, change, tab){
  // if not already logged in, prompt login
  //else do nothing, allow login
  chrome.tabs.sendMessage(tabId, {}, function(obj){
    var website = null;
    var token = 33454;
    chrome.tabs.get(tabId, function(tab){
      website = tab.url;
    })
    //package with curent token
    //send to backend
    $.ajax('localhost:3000', {
      method: POST,
      data: {
        token: token,
        website: website
      },
      success: function(data) {
        console.log(data);
      }
    })
    // wait for approval
    // Once approved, insert info from the return of the approval (backend)
    // login as usual
  })
})
