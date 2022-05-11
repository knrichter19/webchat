const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

app.get("/", (req,res) =>{
    res.send("welcome to your server!");
})

app.post("/join", (req, res) =>{
    console.log('/join post');
    //parse request
    console.log(`joining ${req.body.room} as ${req.body.username}`);
    res.send("hello world");
    //res.redirect("/chat");
    //redirect
});

app.get("/chat", (req,res) =>{
    console.log("/chat get");
    res.send("chat.html");
});

// express server setup 
const server = http.createServer(app);
server.listen(3001, 'localhost');
server.on('listening', function() {
    console.log('Express server started on port %s at %s', server.address().port, server.address().address);
});

// socket.io setup
const io = require("socket.io")(3000, {cors: {
    origin: "*", // allow all connections for testing purposes
    methods: ["GET", "POST"]
}});

const CHAT_MESSAGE_EVENT = 'chat-message';
const SERVER_MESSAGE_EVENT = 'server-message';
const JOIN_ROOM_EVENT = 'join-room';
const LEAVE_ROOM_EVENT = 'leave-room';
const CONNECTION_EVENT = 'connection-message'

const shittyUserDatabase = new Object(); // map of socket.id : {globalID: id, username: username}
const shittyUsernameMapping = new Object();
var shittyUserGlobalIDs = 0;
const genericRoomId = "0000";

// new user connection through socket.io
io.on('connection', socket => {
    console.log("connection");

    // store their info
    let identifier = socket.id;
    let newUserObj = new Object();
    newUserObj["globalId"] = shittyUserGlobalIDs++;
    shittyUserDatabase[identifier] = newUserObj;

    // emits to user that connected for immediate verification that it worked - change this later
    socket.emit(SERVER_MESSAGE_EVENT, {"username":"System", "message":`Hello you are user ${shittyUserDatabase[identifier]["globalId"]}`});


    socket.on(JOIN_ROOM_EVENT, data =>{
        // event for when the user wants to join a new chatroom
        // data: {username:string, roomcode:string}
        username = data["username"];
        roomCode = data["roomcode"];

        console.log("global rooms: ", io.sockets.adapter.rooms);
        if (!io.sockets.adapter.rooms.get(roomCode)){
            roomCode = genRoomCode(4, io.sockets.adapter.rooms);
        }

        socket.join(roomCode);
        io.to(roomCode).emit(SERVER_MESSAGE_EVENT, {"username":"System", "message":`${username} has joined the room!`}); // todo: check this works
        console.log("rooms: ", socket.rooms);

        // add to dict object: username, room code, socketId
        shittyUserDatabase[socket.id]["username"] = username;

        socket.emit(SERVER_MESSAGE_EVENT, {"username":"System", "message":`Your username is ${username} and you are in room ${roomCode}`});
    });

    socket.on(CHAT_MESSAGE_EVENT, data => {
        // event for when someone sends a message in the chat + we need to broadcast it
        // data: {message:string, room:string}
        message = data["message"];
        room = data["room"];

        // validate that socket is in that room
        if (socket.rooms.has(room)){
            // broadcast to full room
            data = {"message":message, "username":shittyUserDatabase[socket.id]["username"]};
            socket.to(room).emit('chat-message', data);
        }
    });

    function sendLeaveMessage(room){
        socket.to(room).emit(`${shittyUserDatabase[socket.id].username} has left the room`);
    }

    // todo: test this
    socket.on(LEAVE_ROOM_EVENT, data =>{
        //data: {'room':string}
        sendLeaveMessage(data.room);
        socket.leave(room);
    });

    socket.on("disconnect", function(){
        console.log("disconnect");

        socket.rooms.forEach(room =>{
            sendLeaveMessage(room);
            socket.leave(room); // maybe unnecessary?
        });

        delete shittyUserDatabase[socket.id];
    });

});


// gen room code
function genRoomCode(numLetters, existingCodes){
    const lettersToUse = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let code = "";
    while (!existingCodes.has(code)){ // todo: make this better
        for (i = 0; i < numLetters; i++){
            randomPos = Math.floor(Math.random() * length(lettersToUse));
            code += lettersToUse.substring(randomPos, randomPos+1);
        }
    }
    return code;
}

// todo: figure out how to handle disconnects