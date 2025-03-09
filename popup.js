document.addEventListener('DOMContentLoaded', function() {
  const connectorSelect = document.getElementById('connector');
  const getCredsButton = document.getElementById('get-creds-button');
  const messageDiv = document.getElementById('message');

  getCredsButton.addEventListener('click', function() {
    const connector = connectorSelect.value;
    getSessionInfo(connector);
  });

  function getSessionInfo(connector) {
    chrome.runtime.sendMessage({ action: 'getSessionInfo', connector: connector }, function(response) {
      if (response && response.email) {
        const email = response.email;
        requestCreds(email, connector);
      } else 
      {
        const email = prompt("Please enter your email:");
        if (email) {
          chrome.runtime.sendMessage({ action: 'storeEmail', email: email }, function() {
            requestCreds(email, connector);
          });
        } else {
          messageDiv.innerHTML = `<p>Error: Email is required to get credentials.</p>`;
        }
      }
    });
  }

  
  function requestCreds(email, connector) {
    console.log(`Requesting creds for email: ${email}, connector: ${connector}`);

    const url = new URL('http://invnalexlinux01.informatica.com:5000/details/' + connector);
    url.searchParams.append('email', email);

    fetch(url, {
      method: 'GET'
    })
    .then(response => {
      console.log('Response:', response);
      return response.json();
    })
    .then(data => {
      console.log('Data:', data);
      if (data.message) {
        messageDiv.innerHTML = `<p>${data.message}</p>`;
      } else {
        messageDiv.innerHTML = formatResponse(data);
      }
    })
    .catch(error => {
      console.error('Error:', error);
      messageDiv.innerHTML = `<p>Error: ${error.message}</p>`;
    });
  }
});

function formatResponse(data) {
  let formattedHtml = '<div class="creds-container">';
  for (const [key, value] of Object.entries(data)) {
    formattedHtml += `<div class="cred-item"><span class="cred-key">${key}:</span> <span class="cred-value">${value}</span></div>`;
  }
  formattedHtml += '</div>';
  return formattedHtml;
}

