// Injected into every page
// Listen for messages from the background
chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse){
  // If theres contents in the msg, then continue is good to go
  if(msg.verified) {
    login(msg)
    // Otherwise make a request to login
  } else {
    checker(sendResponse())
  }
})

function checker(callback) {
  var isLoginForm = $(':password').length;
  if(isLoginForm){
    console.log('over here');
    var parentForm = $(':password').closest('form')[0];
    console.log(parentForm);
    // setTimeout(function(){parentForm.submit()}, 1000)
  }
}



function login(msg) {
  var parentForm = $(':password').closest('form');
  $(':password').val(msg.password);
  $(':password').siblings('input').val(msg.username)[0];
}
