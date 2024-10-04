const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema({
    level: { type: String, required: true },
    guildname: { type: String, required: true },
    expr: { type: String, required: true },
});

const model = mongoose.model("db0", profileSchema);

module.exports = model;
