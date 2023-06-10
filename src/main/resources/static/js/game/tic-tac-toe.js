let user1 = lobby.users[0]
let user2 = lobby.users[1]

let canvas = document.createElement("canvas");

document.body.appendChild(canvas);

let users = document.createElement("div");
users.id = "users";

let user1Element = document.createElement("p");
user1Element.className = "user";
user1Element.innerHTML = user1.name;
user1Element.setAttribute("separationId",user.separationId);
users.appendChild(user1Element);

let user2Element = document.createElement("p");
user2Element.className = "user";
user2Element.innerHTML = user2.name;
user2Element.setAttribute("separationId",user.separationId);
users.appendChild(user2Element);

document.body.appendChild(users);