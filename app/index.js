import * as messaging from "messaging";
import document from "document";

// Need help ? ;)
// https://dev.fitbit.com/guides/communications/messaging/#overview

let text = document.getElementById("text");

// Request data from the companion
function fetchData() {
  text.innerText = "Asking...";
  if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
    // Send a command to the companion
    messaging.peerSocket.send({
      command: 'weight'
    });
  }
  else{
    text.innerText = "Asking again...";
    // Try again
    setTimeout(fetchData,5000);
  }
}

// Display the data received from the companion
function processData(data) {
  if(!data.error){
    text.innerText = data.weight+"kg"; // Metric system by default
  }
  else{
    text.innerText = "Error: " + data.errorTypes.join(', ');
    // Try again
    setTimeout(fetchData,5000);
  }
}

// Listen for the onopen event
messaging.peerSocket.onopen = function() {
  // Fetch data when the connection opens
  fetchData();
}

// Listen for messages from the companion
messaging.peerSocket.onmessage = function(evt) {
  if (evt.data) {
    processData(evt.data);
  }
}

// Listen for the onerror event
messaging.peerSocket.onerror = function(err) {
  text.innerText = "Error...";
  // Handle errors
  console.log("Connection error: " + err.code + " - " + err.message);
}
