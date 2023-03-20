const handlers = [
{"name": "userJoined","handler":userJoined},
{"name": "userChangeName","handler":userChangeName}
]
function userJoined(message) {
    console.log(message)
}
function userChangeName(message) {
    console.log(message);
}