// Injected into every

chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse){
  checker(function(message){
    sendResponse()
  })
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
