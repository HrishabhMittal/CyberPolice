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
            const { expr, level } = i;
            if (content.match(RegExp(expr)) != null) {
                await msg.delete();
                if (Number(level) == 2) {
                    await msg.author.send(
                        `THE FOLLOWING MESSAGE VIOLATED THE REGEX: ${msg.content}`
                    );
                    await msg.channel
                        .send(`[WARNING] @${msg.author.tag} your previous message (check your DMs)
                    has violated regex ${expr} of severity level 2!`);
                }
                if (Number(level) == 3) {
                    await msg.author.send(
                        `THE FOLLOWING MESSAGE VIOLATED THE REGEX: ${msg.content}. you have been kicked from the server.`
                    );
                    await msg.guild.members.cache
                        .find((user) => user.id === msg.author.id)
                        .kick({ reason: "violation of banned regex" });
                }
                if (Number(level) > 3) {
                    await msg.author.send(
                        `THE FOLLOWING MESSAGE VIOLATED THE REGEX: ${msg.content}. you have been banned from the server.`
                    );
                    await msg.guild.members.cache
                        .find((user) => user.id === msg.author.id)
                        .ban({ reason: "violation of banned regex" });
                }
                break;
            }
        }
    },
};
