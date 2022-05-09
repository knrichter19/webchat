function addMsgToView(data){
    const msgContainer = document.getElementById("message-container");
    const newMsg = document.createElement("div");
    newMsg.classList.add("msg-row");
    newMsg.innerText = data;
    msgContainer.appendChild(newMsg);
}

function startSocketConnection(){
    const socket = io('http://localhost:3000');

    socket.on("connect", (stream) => {
        console.log("connection");
        socket.emit("join-room", {"roomcode":"0000", "username": "bob"});
    })
    
    socket.on("chat-message", data => {
        console.log(data);
        addMsgToView(data);
    });

    return socket;
}


let sock = startSocketConnection();

document.getElementById("send-container").addEventListener("submit", event => {
    // don't submit anything - maybe change from using a form?
    event.preventDefault();
    let msgTxt = document.getElementById("message-input").value;
    if (msgTxt.Length == 0) return false;
    // transmit msg + room
    data = {"message":msgTxt, "room":"0000"}
    sock.emit("chat-message", data);
    // update own view
    addMsgToView(msgTxt);
    return false;
})



// make function for hiding login screen
function makeUILoggedIn(){
    // enable buttons
    // hide/delete login form
    // make main part not blurry
    // fill in stuff like room code, username, etc 
}