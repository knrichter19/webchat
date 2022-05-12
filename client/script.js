const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const username = urlParams.get('username');
const roomcode = urlParams.get('roomcode');
console.log(username, roomcode);

function addMsgToView(data){
    const msgContainer = document.getElementById("message-container");
    const newMsg = document.createElement("div");
    newMsg.classList.add("msg-row");
    newMsg.innerText = `${data["username"]}:\n${data["message"]}`;
    msgContainer.appendChild(newMsg);
}

function startSocketConnection(){
    const socket = io('http://localhost:3000');

    socket.on("connect", (stream) => {
        console.log("connection");
        let y = socket.emit("join-room", {"roomcode":roomcode, "username": username});
        console.log(y);
    });
    
    socket.on("chat-message", data => {
        console.log(data);
        addMsgToView(data);
    });

    socket.on("server-message", data =>{
        console.log(data);
        addMsgToView(data);
    });

    return socket;
}

function submitCredentials(){
    // get text fields for username + password + send to 
}


let sock = startSocketConnection();

document.getElementById("send-form").addEventListener("submit", event => {
    // don't submit anything - maybe change from using a form?
    event.preventDefault();
    let msgTxt = document.getElementById("message-input").value;
    if (msgTxt.Length == 0) return false;
    // transmit msg + room
    data = {"message":msgTxt, "room":roomcode}
    sock.emit("chat-message", data);
    // update own view
    addMsgToView({"username": username, "message":msgTxt}); // todo: remove hardcoded username
    return false;
})



// make function for hiding login screen
function makeUILoggedIn(){
    // enable buttons
    // hide/delete login form
    // make main part not blurry
    // fill in stuff like room code, username, etc 
}