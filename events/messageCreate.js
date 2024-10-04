const { Events, Message } = require("discord.js");
const profileModel = require("../models/profileSchema");
require("dotenv").config();
module.exports = {
    name: Events.MessageCreate,
    /**@param {Message} msg */
    async execute(msg) {
        if (msg.author.bot) return;
        const content = msg.content;
        const x = await profileModel.find({ guildname: msg.guild.id });
        for (const i of x) {
            const { expr } = i;
            if (content.match(RegExp(expr)) != null) {
                msg.reply("banning..");
                msg.guild.members.cache
                    .find((user) => user.id === msg.author.id)
                    .ban({ reason: "violation of banned regex" });
                return;
            }
        }
    },
};
