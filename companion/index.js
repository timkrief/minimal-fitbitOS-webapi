import * as messaging from "messaging";
import * as util from "../common/utils";
import { settingsStorage } from "settings";

// Need help ? ;)
// https://dev.fitbit.com/guides/companion/#overview
// https://dev.fitbit.com/guides/communications/messaging/#overview

// Fetch the data from fitbit webAPI
function queryFitbitData() {
  
  // Here, you just have to change this URL to get something else from fitbit webAPI
  //    see https://dev.fitbit.com/reference/web-api/quickstart/
  // Don't forget to change the scope in "common/constants.js"
  //    see https://dev.fitbit.com/reference/web-api/oauth2/#scope
  const url = "https://api.fitbit.com/1/user/-/body/log/weight/date/"+util.formatDate(new Date())+"/1m.json"
  const accept = 'application/x-www-form-urlencoded';
  const authorization = "Bearer "+JSON.parse(settingsStorage.getItem('oauth')).access_token;
  
  let headers = new Headers();
  headers.append('Accept', accept);
  headers.append('Authorization', authorization);
  
  const options = {
    method: 'GET',
    headers: headers
  };

  fetch(url,options)
  .then(function (response) {
      response.json()
      .then(function(data) {
        let importantData = {};
        // you can deal with errors and send them to the watch
        //    see https://dev.fitbit.com/reference/web-api/oauth2/#api-request-errors
        if(data["success"] == false){
          importantData.error = true;
          importantData.errorTypes = [];
          if(data["errors"]){
            data["errors"].map(function(error){
              console.log(error["errorType"] + ": " + error["message"]);
              importantData.errorTypes.push(error["errorType"]);
            });
          }
        }
        else{
          // I just want the weight for this example
          //    see https://dev.fitbit.com/reference/web-api/body/#get-weight-logs
          if(data["weight"] && data["weight"].length>0)
            importantData.weight = data["weight"][data["weight"].length - 1]["weight"]; // I don't know for a fact that it's the latest log...
          else{
            importantData.error = true;
            importantData.errorTypes = ["no log"];
          }
        }
        // Send the data to the device
        returnData(importantData);
      });
  })
  .catch(function (err) {
    console.log("Error fetching data: " + err);
  });
}

// Send the data to the device
function returnData(data) {
  if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
    // Send a command to the device
    messaging.peerSocket.send(data);
  } else {
    console.log("Error: Connection is not open");
  }
}

// Listen for messages from the device
messaging.peerSocket.onmessage = function(evt) {
  if (evt.data && evt.data.command == "weight") {
    // The device requested weight data
    queryFitbitData();
  }
}

// Listen for the onerror event
messaging.peerSocket.onerror = function(err) {
  // Handle any errors
  console.log("Connection error: " + err.code + " - " + err.message);
}