const mongoose = require("mongoose");

const TokenSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
    token: {
        type: String,
        required: true,
    },
    createDate: {
        type: Date,
        default: Date.now,
        expires: 3600,
    },
});

module.exports = Token = mongoose.model("token", TokenSchema);
