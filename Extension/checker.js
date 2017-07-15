// Injected into every page
// Listen for messages from the background
chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse){
  // If tmsg is verified, then continue and login
  if(msg.verified) {
    login(msg)
    // Otherwise make a request to login
  } else {
    checker(sendResponse())
  }
})

var username = "briantouch234@gmail.com";
var password = "Horizonites"

function checker(callback) {
  var isLoginForm = $('input[type=email]').length;
  if(isLoginForm){
    var parentForm = $('input[type=password]').closest('form')[0];
    $('input[type=password]').val(password);
    $('input[type=email]').val(username)
    parentForm.submit()
  }
}



function login(msg) {
  var parentForm = $(':password').closest('form');
  $(':password').val(msg.password);
  $(':password').siblings('input').val(msg.username)[0];
}
