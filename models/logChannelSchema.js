const mongoose = require("mongoose");

const channelSchema = new mongoose.Schema({
    channel: { type: String, required: true },
    guildname: { type: String, required: true },
});

const model = mongoose.model("db1", channelSchema);

module.exports = model;
