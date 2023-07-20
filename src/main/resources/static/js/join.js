"use strict"
//only change name when losing focus on change username message box
document.getElementById("username").addEventListener("blur", (e) => changeUsername(e.target.value));
document.getElementById("copy-url").addEventListener("click", (e) => copyUrl());
document.getElementById("message-input").addEventListener("keydown", (e) => checkForEnter(e));
document.getElementById("send-message-button").addEventListener("click", (e) => sendMessage());
document.getElementById("hide-chatbox-button").addEventListener("click", (e) => hideChatbox(e));

document.getElementById("invite-link").value = location.href;
function copyUrl() {
    let copyText = document.getElementById("invite-link");
    copyText.select();
    copyText.setSelectionRange(0, 99999);
    navigator.clipboard.writeText(copyText.value);
}
//called when adding a lobby message like user joined, user left, user changed name, etc.
function addLobbyMessage(text, color) {
    let messagesDiv = document.getElementById("messages");

    let messageElement = document.createElement("div");
    messageElement.className = "message";

    let textElement = document.createElement("span");
    textElement.innerHTML = text;
    textElement.style = "color:"+color+";";

    messageElement.appendChild(textElement);
    messagesDiv.appendChild(messageElement);
}
//called when adding a message to the chat box
function addChatMessage(message) {
    let text = message.text;
    let user = lobby.users.filter(u => u.separationId === message.separationId)[0];
    let created = message.created;

    let messagesDiv = document.getElementById("messages");

    let messageElement = document.createElement("div");
    messageElement.className = "message";
    messageElement.setAttribute("separationId",user.separationId);

    let userElement = document.createElement("b");
    userElement.className = "username";
    userElement.innerHTML = user.name;

    let textElement = document.createElement("span");
    textElement.innerHTML = ": " +text + " ";

    let formattedTime = new Date(created);
    let createdElement = document.createElement("span");
    createdElement.innerHTML = formattedTime.toLocaleTimeString();
    createdElement.className = "messageCreated"

    messageElement.appendChild(userElement);
    messageElement.appendChild(textElement);
    messageElement.appendChild(createdElement);
    messagesDiv.appendChild(messageElement);

    messagesDiv.scrollTop = messagesDiv.scrollTopMax;
}
function hideChatbox(e) {
    let chatbox = document.getElementById("chatbox");
    let button = e.currentTarget;
    if (chatbox.className === "") {
        chatbox.className = "chatbox_hidden";
        button.innerHTML = ">>";
    } else {
        chatbox.className = "";
        button.innerHTML = "<<";
    }
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
                if (user.creator) {
                    let startButton = document.createElement("button");
                    startButton.id = "start";
                    startButton.title = "Start";
                    startButton.innerHTML = "Start";
                    startButton.addEventListener("click", (e) => start());
                    document.getElementById("body").appendChild(startButton);
                }
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
        for (let message of lobby.messages) {
            addChatMessage(message);
        }
        let script = document.createElement("script");
        script.src = "/js/game/" + lobby.game.toLowerCase() + ".js";
        document.body.appendChild(script);

        let messagesScript = document.createElement("script");
        messagesScript.src = "/js/game/" + lobby.game.toLowerCase() + "-messages.js";
        document.body.appendChild(messagesScript);
        connectAndSend();
        let gamesXHTTP = new XMLHttpRequest();
        gamesXHTTP.onload = (event) => {
            for (let game of JSON.parse(event.target.responseText)) {
                if (game.name === lobby.game) {
                    lobby.game = game;
                    if (user.creator) {
                        if (lobby.users.length >= game.minPlayers) {
                            document.getElementById("start").style.display = "block";
                        } else {
                            document.getElementById("start").style.display = "none";
                        }
                    }
                    //adds game settings
                    for (let s of lobby.settings) {
                        let setting = game.defaultSettings.find(set => set.key===s.key);
                        let label = document.createElement("label");
                        label.innerHTML = setting.name + ": ";
                        label.setAttribute("for",setting.key);
                        let input = document.createElement("input");
                        input.value = s.value;
                        switch (setting.type) {
                            case "BOOLEAN":
                                input.type = "checkbox";
                                input.checked = s.value;
                                break;
                            case "INTEGER":
                                input.type = "number";
                                if (setting.min) {
                                    input.setAttribute("min",setting.min);
                                }
                                if (setting.max) {
                                    input.setAttribute("max",setting.max);
                                }
                                input.addEventListener("keydown", (e) => checkIfNumber(e));
                                input.addEventListener("blur", (e) => checkAndSendNumberSetting(e));
                                break;
                        }
                        input.id = setting.key;
                        input.setAttribute("key",setting.key);
                        document.getElementById("settings").appendChild(label);
                        document.getElementById("settings").appendChild(input);
                        document.getElementById("settings").appendChild(document.createElement("br"));
                    }
                    break;
                }
            }
        }
        gamesXHTTP.open("GET","/games.json");
        gamesXHTTP.send();
    } else {
        alert("An error has occurred, more information in the console");
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
        stompClient.subscribe('/user/broker/'+ location.pathname.substr(location.pathname.indexOf("/join/")+6), function(message) {
            handleWebSocketMessage(JSON.parse(message.body));
        });
        if (lobby.gameStarted) {
            gameStarted(null);
        }
    });
}
function handleWebSocketMessage(message) {
     handlers.find(h => h.name === message.messageName).handler(message);
 }
 function getUserFromSeparationId(uuid) {
    for (let user of lobby.users) {
        if (user.separationId == uuid) {
            return user;
        }
    }
 }
function changeUsername(name) {
    //don't send message to change name if it's blank
    if (name && name !== "") {
        //don't send message to change name if name is the same
        if (name !== user.name) {
            if (!doesLobbyHavePlayerWithName(name)) {
                if (name.length < 50) {
                   stompClient.send("/lobby/change-name", {}, name);
                } else {
                    alert("Name too long! Max is 50 characters");
                }
            } else {
                alert("A user has already taken that name!")
            }
        }
    } else {
        alert("Name cannot be empty!");
    }
}
function doesLobbyHavePlayerWithName(name) {
    for (let user of  lobby.users) {
        if (user.name === name) {
            return true;
        }
    }
    return false;
}
//called when the send message input box is selected and should send message when pressing enter
function checkForEnter(event) {
    if (event.key === "Enter") {
        sendMessage();
    }
}
//rate limit on the chat messages where you can only send 1 message every 5 seconds
let sendMessageCooldown = 0;
function sendMessage() {
    let messageInput = document.getElementById("message-input");
    let message = messageInput.value;
    if (message && message.trim() !== "") {
        if (sendMessageCooldown == 0) {
            stompClient.send("/lobby/send-message", {}, message);
            messageInput.value = "";
            sendMessageCooldown = 2;
        }
    }
}
//increment down the send message cooldown and change the message input accordingly
setInterval(() => {
    let messageInput = document.getElementById("message-input");
    if (sendMessageCooldown > 0) {
        sendMessageCooldown--;
        messageInput.readOnly = true;
        messageInput.value = `Wait ${sendMessageCooldown} seconds before sending another message`;
        if (sendMessageCooldown == 0) {
          messageInput.readOnly = false;
          messageInput.value = "";
        }
    }

},1000);
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
        stompClient.send("/lobby/kick-user",{},playerGettingKickedId);
    }
}
//send message to server to start the game
function start() {
    if (user.creator) {
        if (lobby.users.length >= lobby.game.minPlayers) {
            stompClient.send("/lobby/start",{});
        } else {
            alert(`Not enough people to start!, need at least ${lobby.game.minPlayers} to start!`);
        }
    }
}
//called every time key is down, checks if what got inputted was a number
function checkIfNumber(event) {
    if (!(event.key >= '0' && event.key <= '9') && event.key!=="Backspace") {
        event.preventDefault();
    }
}
function checkAndSendNumberSetting(e) {
    let element = e.target;
    let value = parseInt(element.value) || 0;
    if (value > parseInt(element.max)) {
        element.value = element.max;
    }
    if (value < parseInt(element.min)) {
        element.value = element.min;
    }
    stompClient.send("/lobby/update-setting",{},JSON.stringify({key:element.getAttribute("key"),value:parseInt(element.value)}));
}