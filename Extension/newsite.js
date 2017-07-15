chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse){
  console.log('newsite');
  window.open("chrome-extension://mfakecclmmkepmfalkmmblkfakffbpkl/popup.html", "Login", "width=100,height=100,status=no,resizable=no");
})
