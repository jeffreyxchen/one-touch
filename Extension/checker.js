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


function checker(callback) {
  var isLoginForm = $('input[type=email]').length;
  if(isLoginForm){
    login()
  }
}



function login(msg) {
  var parentForm = $('input[type=password]').closest('form')[0];
  $('input[type=password]').val(msg.password);
  $('input[type=email]').val(msg.username)
  parentForm.submit()
}
