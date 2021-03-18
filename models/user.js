const mongoose = require("mongoose")
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String,
    moderator: {type: Boolean, default: false}
})

userSchema.plugin(passportLocalMongoose)

module.exports = mongoose.model("User", userSchema);