
function startSocketConnection(){
    const socket = io('http://localhost:3000');
    const msgContainer = document.getElementById("message-container");

    socket.on("chat-message", data => {
        console.log(data);
        const newMsg = document.createElement("div");
        newMsg.classList.add("msg-row");
        newMsg.innerText = data;
        msgContainer.appendChild(newMsg);
    });

    return socket;
}

// make onclick for join form



// make onclick for create form
document.getElementById("")


// make function for hiding login screen
function makeUILoggedIn(){
    // enable buttons
    // hide/delete login form
    // make main part not blurry
    // fill in stuff like room code, username, etc 
}