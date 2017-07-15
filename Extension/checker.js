// Injected into every page
// Listen for messages from the background
chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse){
  // If theres contents in the msg, then continue is good to go
  if(msg) {
    login(msg)
    // Otherwise make a request to login
  } else {
    checker(function(message){
      sendResponse()
    })
  }
})

function checker(callback) {
  var isLogin = $(':password').length;
  if(isLogin){
    $(':password').val('');
    var parentForm = $(':password').closest('form');
    parentForm.submit(function(e){
      e.preventDefault();
      callback(oneTouch())
    })
  }
}

function oneTouch() {
  return "called one touch";
}

function login(msg) {
  var parentForm = $(':password').closest('form');
  $(':password').val(msg.password);
  $(':password').siblings('input').val(msg.username)[0];
}
