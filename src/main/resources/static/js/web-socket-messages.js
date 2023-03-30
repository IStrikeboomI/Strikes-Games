const handlers = [
{"name": "userJoined","handler":userJoined},
{"name": "userChangedName","handler":userChangedName},
{"name": "userKicked","handler":userKicked}
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
    console.log(message);
}