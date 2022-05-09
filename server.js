const io = require("socket.io")(3000, {cors: {
    origin: "*", // allow all connections for testing purposes
    methods: ["GET", "POST"]
}});

const CHAT_MESSAGE_EVENT = 'chat-message';
const JOIN_MESSAGE_EVENT = 'join-message';
const JOIN_ROOM_EVENT = 'join-room';
const LEAVE_MESSAGE_EVENT = 'leave-message';
const LEAVE_ROOM_EVENT = 'leave-room';

const shittyUserDatabase = new Object(); // map of socket.id : {globalID: id, username: username}
const shittyUsernameMapping = new Object();
var shittyUserGlobalIDs = 0;
const genericRoomId = "0000";

// new user connection through socket.io
io.on('connection', socket => {
    console.log("connection");
    let identifier = socket.id;
    let newUserObj = new Object();
    newUserObj["globalId"] = shittyUserGlobalIDs++;
    shittyUserDatabase[identifier] = newUserObj;
    // emits to user that connected
    socket.emit('chat-message', `Hello you are user ${shittyUserDatabase[identifier]["globalId"]}`);
    console.log(shittyUserDatabase);

    // remove this once i change to different setup
    //socket.join(genericRoomId);

    socket.on(JOIN_ROOM_EVENT, data =>{
        // data: {username:string, roomcode:string}
        // get username, room code from data
        username = data["username"];
        roomCode = data["roomcode"];
        // if no room code: create new room code + socket.join(code)
        // elif room code doesn't exist: respond with error
        // elif valid room code: socket.join(code)
        socket.join(roomCode);
        // add to dict object: username, room code, socketId
        shittyUserDatabase[socket.id]["username"] = username;

        socket.emit("chat-message", `Your username is ${username} and you are in room ${roomCode}`);
    });

    socket.on(CHAT_MESSAGE_EVENT, data => {
        // data: {message:string, room:string}
        message = data["message"];
        room = data["room"];
        // validate that socket is in that room
        if (socket.rooms.has(room)){
            // broadcast to full room
            socket.to(room).emit('chat-message', message);
        }
    });

    socket.on(LEAVE_ROOM_EVENT, _ =>{
        // get the room they're in + broadcast 'left' message
    });

    socket.on("disconnect", function(){
        console.log("disconnect");
        delete shittyUserDatabase[socket.id];
    })

});

// gen room code

// todo: figure out how to handle disconnects