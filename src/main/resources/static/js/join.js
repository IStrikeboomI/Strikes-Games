"use strict"
//When the user changes name using the change name box, only send request to change name if it's been n seconds since last change name
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
    //start a timer for 2 seconds
    secondsUntilNameChange = 2;
}

document.getElementById("invite-link").value = location.href;
function copyUrl() {
    let copyText = document.getElementById("invite-link");
    copyText.select();
    copyText.setSelectionRange(0, 99999);
    navigator.clipboard.writeText(copyText.value);
}


var lobby;
//the user that's the browser is on
var user;
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

            if (user.separationId == localStorage.getItem("separationId")) {
                document.getElementById("username").value = user.name;
                this.user = user;
            } else {
                div.onmouseenter = (e) => hoverOverUser(e);
                div.onmouseleave = (e) => stopHoverOverUser(e);
                div.onclick = (e) => clickOnUser(e);
            }

            let hoverText = document.createElement("span");
            hoverText.className = "hoverText";

            div.appendChild(username);
            div.appendChild(userAttributes);
            div.appendChild(hoverText);
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
function handleWebSocketMessage(message) {
     handlers.find(h => h.name === message.messageName).handler(message);
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
//Used for the red text and strikethrough when hovering over user to kick it
function hoverOverUser(event) {
    if (user.creator) {
        let element = event.target;
        element.style.color = "red";
        element.style.textDecoration = "line-through";
        element.style.cursor = "pointer";
        let hoverText = element.getElementsByClassName("hoverText")[0];
        hoverText.style.color = "gray";
        hoverText.style.userSelect = "none";
        hoverText.style.textDecoration = "none";
        hoverText.style.display = "inline-block";
        hoverText.style.padding = "5px";
        hoverText.innerHTML = " Click to kick user";
    }
}
function stopHoverOverUser(event) {
    if (user.creator) {
        let element = event.target;
        element.style.color = "";
        element.style.textDecoration = "";
        let hoverText = element.getElementsByClassName("hoverText")[0];
        hoverText.innerHTML = "";
    }
}
//used for kicking user
function clickOnUser(event) {
    if (user.creator) {
        let playerGettingKickedId = event.currentTarget.getAttribute("separationId");
        console.log(playerGettingKickedId);
        stompClient.send("/lobby/kick-user",{},playerGettingKickedId);
    }
}