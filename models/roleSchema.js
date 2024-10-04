const mongoose = require("mongoose");

const roleSchema = new mongoose.Schema({
    role: { type: String, required: true },
    guildname: { type: String, required: true },
});

const model = mongoose.model("db1", roleSchema);

module.exports = model;
