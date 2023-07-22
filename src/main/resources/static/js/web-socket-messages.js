const handlers = [
{"name": "gameMessage","handler":gameMessage},
{"name": "userJoined","handler":userJoined},
{"name": "userChangedName","handler":userChangedName},
{"name": "userKicked","handler":userKicked},
{"name": "userDisconnected","handler":userDisconnected},
{"name": "userReconnected","handler":userReconnected},
{"name": "userSentMessage","handler":userSentMessage},
{"name": "gameStarted","handler":gameStarted},
{"name": "gameRestarted","handler":gameRestarted},
{"name": "gameSettingUpdated","handler":gameSettingUpdated}
]
function gameMessage(message) {
    if (lobby.gameStarted) {
        gameMessageHandlers.find(h => h.name === message.gameMessageName).handler(message.data);
    }
}
function userJoined(message) {
    lobby.users.push(message.user);

    let div = document.createElement("div");
    div.className = "user";
    div.setAttribute("separationId",message.user.separationId);

    //used for showing the user name
    let username = document.createElement("span");
    username.className = "username"
    username.innerHTML = message.user.name

    //used for extra attributes such as Lobby Creator or You!
    let userAttributes = document.createElement("span");
    userAttributes.className="userAttributes"
    userAttributes.innerHTML = " "+ (message.user.creator ? " (Lobby Creator)" : "");

    div.onmouseenter = (e) => hoverOverUser(e);
    div.onmouseleave = (e) => stopHoverOverUser(e);
    div.onclick = (e) => clickOnUser(e);

    let hoverText = document.createElement("span");
    hoverText.className = "hoverText";

    div.appendChild(username);
    div.appendChild(userAttributes);
    div.appendChild(hoverText);
    document.getElementById("users").appendChild(div);

    addLobbyMessage("User Joined","#75FC0F");

    if (user.creator && lobby.users.length >= lobby.game.minPlayers) {
        document.getElementById("start").style.display = "block";
    }
}
function userChangedName(message) {
    let userId = message.separationId;
    lobby.users.find(u => u.separationId === message.separationId).name = message.name;
    let oldUserName;
    for (let user of document.querySelectorAll('[separationId]')) {
        if (user.getAttribute("separationId") === userId) {
            for (let children of user.children) {
                if (children.className === "username") {
                    oldUserName = children.innerHTML;
                    children.innerHTML = message.name;
                }
            }
        }
    }
    addLobbyMessage(`User ${oldUserName} Changed Name To ${message.name} `,"#1A1A1E80");
}
function userKicked(message) {
    let userId = message.separationId;
    let name = lobby.users.filter(u => u.separationId === userId)[0].name;
    lobby.users = lobby.users.filter(u => u.separationId !== userId);
    if (userId === user.separationId) {
        window.location.replace(window.location.origin+"/kicked.html");
    } else {
        for (let user of document.querySelectorAll('[separationId]')) {
            if (user.getAttribute("separationId") === userId) {
                user.remove();
            }
        }
    }
    addLobbyMessage(`User ${name} Kicked`,"#F72035");
    if (user.creator && lobby.users.length < lobby.game.minPlayers) {
        document.getElementById("start").style.display = "none";
    }
}
function userDisconnected(message) {
    let element;
    for (let e of document.querySelectorAll('[separationId]')) {
        if (e.getAttribute("separationId") === message.separationId) {
            element = e;
        }
    }
    if (element) {
        element.style.color = "gray";
        element.style.textDecoration = "line-through";
        let hoverText = element.getElementsByClassName("hoverText")[0];
        if (hoverText) {
            hoverText.style.color = "gray";
            hoverText.style.userSelect = "none";
            hoverText.style.textDecoration = "none";
            hoverText.style.display = "inline-block";
            hoverText.style.padding = "5px";
            hoverText.innerHTML = " User has 60 seconds to reconnect";
        }
    }

    let name = lobby.users.filter(u => u.separationId === message.separationId)[0].name;
    addLobbyMessage(`User ${name} Disconnected`,"#F72035");
}
function userReconnected(message) {
    let element;
    for (let e of document.querySelectorAll('[separationId]')) {
        if (e.getAttribute("separationId") === message.separationId) {
            element = e;
        }
    }
    if (element) {
        element.style.color = "";
        element.style.textDecoration = "";
        let hoverText = element.getElementsByClassName("hoverText")[0];
        if (hoverText) {
            hoverText.style.color = "gray";
            hoverText.style.userSelect = "none";
            hoverText.style.textDecoration = "none";
            hoverText.style.display = "inline-block";
            hoverText.style.padding = "5px";
            hoverText.innerHTML = "";
        }
    }

    let name = lobby.users.filter(u => u.separationId === message.separationId)[0].name;
    addLobbyMessage(`User ${name} Reconnected`,"#75FC0F");
}
function userSentMessage(message) {
    lobby.messages.push(message.chatMessage);
    addChatMessage(message.chatMessage);
}
function gameStarted(message) {
    lobby.gameStarted = true;
    let chatBox = document.getElementById("chatbox");
    let scripts = [];
    for (let e of document.getElementsByTagName("script")) {
        scripts.push(e);
    }
    document.body.innerHTML = "";
    document.body.appendChild(chatBox);

    for (let e of scripts) {
        document.body.appendChild(e);
    }

    let css = document.createElement("link");
    css.rel = "stylesheet";
    css.href = "/css/game/" + lobby.game.name.toLowerCase() + ".css";

    init();

    document.head.appendChild(css);
}
function gameRestarted(message) {
    location.reload();
}
function gameSettingUpdated(message) {
    for (let e of document.querySelectorAll('[key]')) {
        if (e.getAttribute("key") === message.setting.key) {
            addLobbyMessage(`Setting \"${lobby.game.defaultSettings.find(set => set.key===message.setting.key).name}\" changed from ${e.value} to ${message.setting.value}`,"#1A1A1E80");
            e.value = message.setting.value;
            e.checked = message.setting.value;
            lobby.settings.find(s => s.key===message.setting.key).value = message.setting.value;
        }
    }
}
