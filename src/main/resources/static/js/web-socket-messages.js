const handlers = [
{"name": "userJoined","handler":userJoined},
{"name": "userChangedName","handler":userChangedName}
]
function userJoined(message) {
    console.log(message)
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