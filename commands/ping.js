const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("replies with pong!"),
    async execute(i) {
        await i.reply("pong!");
    },
};
