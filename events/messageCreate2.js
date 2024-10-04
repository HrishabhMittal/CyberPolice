const { Events, Message, ChannelType } = require("discord.js");
require("dotenv").config();
const logChannelModel = require("../models/logChannelSchema");
module.exports = {
    name: Events.MessageCreate,
    /**@param {Message} msg */
    async execute(msg) {
        if (msg.author.bot) return;
        if (msg.content == "!setup") {
            let highrole = msg.guild.members.cache.get(msg.author.id).roles
                .highest;
            if (
                highrole === msg.guild.roles.highest ||
                msg.author.id === msg.guild.ownerId
            ) {
                await msg.channel.send("setting up bot...");
                const registerCommands = require("../utils/deploy");
                await registerCommands(
                    process.env.TOKEN,
                    process.env.CLIENT_ID,
                    msg.guild.id
                );
                await msg.channel.send("all commands registered!");
                if (
                    msg.guild.channels.cache.find(
                        (channel) => channel.name === "CyberPolice-logs"
                    )
                ) {
                    await msg.channel.send(
                        "channel already exists for logs..."
                    );
                } else {
                    await msg.channel.send("creating channel for logs...");
                    await msg.guild.channels.create({
                        name: "CyberPolice-logs",
                        type: ChannelType.GuildText,
                    });
                }
                let channelId = msg.guild.channels.cache.find(
                    (channel) => channel.name === "CyberPolice-logs"
                ).id;
                let entry = await logChannelModel.findOne({
                    guildname: msg.guild.id,
                });
                if (entry != null) {
                    await logChannelModel.findOneAndUpdate(
                        {
                            guildname: msg.guild.id,
                        },
                        {
                            guildname: msg.guild.id,
                            channel: channelId,
                        }
                    );
                } else {
                    await logChannelModel.create({
                        channel: channelId,
                        guildname: msg.guild.id,
                    });
                }
                await msg.channel.send("setup complete!");
            } else {
                msg.reply(
                    "you dont have the authority to setup this bot! " +
                        "only the highest role in the server/owner can do this action."
                );
            }
        }
    },
};
