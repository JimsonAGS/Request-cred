
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === 'getSessionInfo') {
    // First try to get email from the session cookie
    chrome.cookies.get({ url: 'http://localhost', name: 'session' }, function(cookie) {
      if (cookie) {
        const email = extractEmailFromSession(cookie.value); // Replace with actual extraction logic
        sendResponse({ email: email });
      } else {
        // If no session cookie, try to get email from the stored cookie
        chrome.cookies.get({ url: 'http://localhost', name: 'userEmail' }, function(emailCookie) {
          if (emailCookie) {
            sendResponse({ email: emailCookie.value });
          } else {
            sendResponse({ email: null });
          }
        });
      }
    });
    return true; 
  } else if (request.action === 'storeEmail') {
    // Store the email in a cookie
    chrome.cookies.set({
      url: 'http://localhost',
      name: 'userEmail',
      value: request.email,
      expirationDate: (new Date().getTime() / 1000) + (365 * 24 * 60 * 60) 
    }, function(cookie) {
      sendResponse();
    });
    return true;
  }
});

function extractEmailFromSession(session) {
  
  const email = 'user@example.com'; 
  return email;
}
