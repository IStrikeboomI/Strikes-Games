const handlers = [
{"name": "userJoined","handler":userJoined},
{"name": "userChangedName","handler":userChangedName},
{"name": "userKicked","handler":userKicked},
{"name": "userDisconnected","handler":userDisconnected},
{"name": "userReconnected","handler":userReconnected},
{"name": "userSentMessage","handler":userSentMessage},
{"name": "gameStarted","handler":gameStarted}
]
function userJoined(message) {
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
}
function userChangedName(message) {
    let userId = message.separationId;
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
    let userId = message.user.separationId;
    if (userId === user.separationId) {
        window.location.replace(window.location.origin+"/kicked.html");
    } else {
        for (let user of document.querySelectorAll('[separationId]')) {
            if (user.getAttribute("separationId") === userId) {
                user.remove();
            }
        }
    }
    addLobbyMessage(`User ${message.user.name} Kicked`,"#F72035");
}
function userDisconnected(message) {
    let element;
    for (let e of document.querySelectorAll('[separationId]')) {
        if (e.getAttribute("separationId") === message.user.separationId) {
            element = e;
        }
    }
    element.style.color = "gray";
    element.style.textDecoration = "line-through";
    let hoverText = element.getElementsByClassName("hoverText")[0];
    hoverText.style.color = "gray";
    hoverText.style.userSelect = "none";
    hoverText.style.textDecoration = "none";
    hoverText.style.display = "inline-block";
    hoverText.style.padding = "5px";
    hoverText.innerHTML = " User has 60 seconds to reconnect";

    addLobbyMessage(`User ${message.user.name} Disconnected`,"#F72035");
}
function userReconnected(message) {
    let element;
        for (let e of document.querySelectorAll('[separationId]')) {
            if (e.getAttribute("separationId") === message.user.separationId) {
                element = e;
            }
        }
        element.style.color = "";
        element.style.textDecoration = "";
        let hoverText = element.getElementsByClassName("hoverText")[0];
        hoverText.style.color = "gray";
        hoverText.style.userSelect = "none";
        hoverText.style.textDecoration = "none";
        hoverText.style.display = "inline-block";
        hoverText.style.padding = "5px";
        hoverText.innerHTML = "";

        addLobbyMessage(`User ${message.user.name} Reconnected`,"#75FC0F");
}
function userSentMessage(message) {
    addChatMessage(message.chatMessage);
}
function gameStarted(message) {
    alert("game started!")
}