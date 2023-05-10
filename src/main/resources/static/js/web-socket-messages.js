const handlers = [
{"name": "userJoined","handler":userJoined},
{"name": "userChangedName","handler":userChangedName},
{"name": "userKicked","handler":userKicked},
{"name": "userDisconnected","handler":userDisconnected},
{"name": "userReconnected","handler":userReconnected},
{"name": "userSentMessage","handler":userSentMessage}
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
    for (let user of document.querySelectorAll('[separationId]')) {
        if (user.getAttribute("separationId") === userId) {
            for (let children of user.children) {
                if (children.className === "username") {
                    children.innerHTML = message.name;
                }
            }
        }
    }
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
}
function userSentMessage(message) {
    addChatMessage(message.chatMessage);
}