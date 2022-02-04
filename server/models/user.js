const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchame = Schema({
    name: String,
    lastname: String,
    email: {
        type:String,
        unique: true
    },
    role: String,
    password: String
});

module.exports = mongoose.model("User", UserSchame);