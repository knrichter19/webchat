const Mongoose = require("mongoose");
const UserSchema = new Mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    socketId: {
        type: String,
        unique: true,
        required: true
    },
    room: {
        type: String,
        required: true,
        default: '0000'
    }
});

const User = Mongoose.model('user', UserSchema);
module.exports = User;