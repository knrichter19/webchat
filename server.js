const io = require("socket.io")(3000, {cors: {
    origin: "*",
    methods: ["GET", "POST"]
}});

const CHAT_MESSAGE_EVENT = 'chat-message';
const JOIN_MESSAGE_EVENT = 'join-message';
const JOIN_ROOM_EVENT = 'join-room';
const LEAVE_MESSAGE_EVENT = 'leave-message';
const LEAVE_ROOM_EVENT = 'leave-room';

const shittyUserDatabase = new Object();
var shittyUserGlobalIDs = 0;

// new user connection
io.on('connection', socket => {
    console.log("connection");
    let identifier = socket.id;
    shittyUserDatabase[identifier] = shittyUserGlobalIDs++;
    socket.emit('chat-message', `Hello you are user ${shittyUserDatabase[identifier]}`);
    console.log(shittyUserDatabase);

    socket.on(JOIN_ROOM_EVENT, data =>{
        // data: {username:string, roomcode:string}
        // get username, room code from data
        // if no room code: create new room code + socket.join(code)
        // elif room code doesn't exist: respond with error
        // elif valid room code: socket.join(code)
        // add to dict object: username, room code, socketId
    });

    socket.on(CHAT_MESSAGE_EVENT, data => {
        // data: {message:string, room:string}
        // validate that socket is in that room
        // broadcast to full room
    });

    socket.on(LEAVE_ROOM_EVENT, _ =>{
        // get the room they're in + broadcast 'left' message
    });
});

// gen room code
