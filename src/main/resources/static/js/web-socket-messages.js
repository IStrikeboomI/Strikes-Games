const handlers = [
{"name": "userJoined","handler":userJoined},
{"name": "userChangedName","handler":userChangedName}
]
function userJoined(message) {
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
    userAttributes.innerHTML = " "+ (user.creator ? " (Lobby Creator)" : "");

    div.appendChild(username);
    div.appendChild(userAttributes);
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