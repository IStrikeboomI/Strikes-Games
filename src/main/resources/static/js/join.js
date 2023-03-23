"use strict"
//When the user changes name using the change name box, only send request to change name if it's been 3 seconds since last change name
//used to limit amount of requests
let secondsUntilNameChange = -1;
setInterval(() => {
    if (secondsUntilNameChange == 0) {
        changeUsername(document.getElementById("username").value);
        //stop the timer
        secondsUntilNameChange = -1;
    } else {
        secondsUntilNameChange--;
    }
},1000);
function checkForChangeUsername() {
    //start a timer for 3 seconds
    secondsUntilNameChange = 3;
}

document.getElementById("invite-link").value = location.href;
function copyUrl() {
    let copyText = document.getElementById("invite-link");
    copyText.select();
    copyText.setSelectionRange(0, 99999);
    navigator.clipboard.writeText(copyText.value);
}
var lobby;
var joined = false;
let xhttp = new XMLHttpRequest();
xhttp.onload = (event) => {
    if (xhttp.status === 200) {
        let response = JSON.parse(xhttp.responseText);
        lobby = response.lobby;
        localStorage.setItem("separationId",response.separationId);
        for (let user of lobby.users) {
            let div = document.createElement("div");
            div.className = "user";
            div.setAttribute("separationId",user.separationId);

            //used for showing the user name
            let username = document.createElement("span");
            username.className = "username"
            username.innerHTML = user.name

            //used for extra attributes such as Lobby Creator or You!
            let userAttributes = document.createElement("span");
            userAttributes.className="userAttributes"
            userAttributes.innerHTML = " "+ (user.creator ? " (Lobby Creator)" : "") + (user.separationId == localStorage.getItem("separationId") ? " (You!)" : "");

            div.appendChild(username);
            div.appendChild(userAttributes);
            document.getElementById("users").appendChild(div);
        }
        connectAndSend();
    } else {
        //alert("An error has occurred, more information in the console");
        console.log(event);
        console.log(xhttp);
    }
};
xhttp.open("POST","/api/lobby/join/"+location.pathname.substr(location.pathname.indexOf("/join/")+6));
xhttp.send();

var stompClient;
function connectAndSend() {
    var socket = new SockJS('/join-lobby');
    stompClient = Stomp.over(socket);
    stompClient.connect({}, function(frame) {
        console.log('Connected: ' + frame);
        stompClient.subscribe('/broker/'+ location.pathname.substr(location.pathname.indexOf("/join/")+6), function(message) {
            handleWebSocketMessage(JSON.parse(message.body));
        });
    });
}
function changeUsername(name) {
    if (name && name !== "") {
        if (name.length < 50) {
           stompClient.send("/lobby/change-name", {}, name);
        } else {
            alert("Name too long! Max is 50 characters");
        }
    } else {
        alert("Name cannot be empty!");
    }
}
function handleWebSocketMessage(message) {
    handlers.find(h => h.name === message.messageName).handler(message);
}