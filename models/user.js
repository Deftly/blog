require("dotenv").config()
const mongoose = require("mongoose")
const encrypt = require("mongoose-encryption")

const userSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String,
    moderator: {type: Boolean, default: false}
})

userSchema.plugin(encrypt, {secret: process.env.SECRET, encryptedFields: ["password"]});

module.exports = mongoose.model("User", userSchema);