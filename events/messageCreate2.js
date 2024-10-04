const {
    Events,
    Message,
    ChannelType,
    PermissionsBitField,
} = require("discord.js");
require("dotenv").config();
const logChannelModel = require("../models/logChannelSchema");
const roleModel = require("../models/roleSchema");
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

                let entry = await roleModel.findOne({
                    guildname: msg.guild.id,
                });
                let roleId;
                if (entry != null && msg.guild.roles.cache.has(entry.role)) {
                    await msg.channel.send(
                        "role already exists for bot manager..."
                    );
                } else {
                    if (entry) {
                        await roleModel.findOneAndDelete({
                            guildname: msg.guild.id,
                        });
                    }
                    await msg.channel.send("creating role for bot manager...");
                    let x = await msg.guild.roles.create({
                        name: "Police",
                        color: "Blue",
                    });
                    await roleModel.create({
                        role: x.id,
                        guildname: msg.guild.id,
                    });
                    roleId = x.id;
                }

                entry = await logChannelModel.findOne({
                    guildname: msg.guild.id,
                });
                if (
                    entry != null &&
                    msg.guild.channels.cache.has(entry.channel)
                ) {
                    await msg.channel.send(
                        "channel already exists for logs..."
                    );
                } else {
                    if (entry) {
                        await logChannelModel.findOneAndDelete({
                            guildname: msg.guild.id,
                        });
                    }
                    await msg.channel.send("creating channel for logs...");
                    let x = await msg.guild.channels.create({
                        name: "CyberPolice-logs",
                        type: ChannelType.GuildText,
                        permissionOverwrites: [
                            {
                                id: msg.guild.roles.everyone.id,
                                deny: [PermissionsBitField.Flags.ViewChannel],
                            },
                            {
                                id: roleId,
                                allow: [PermissionsBitField.Flags.ViewChannel],
                            },
                        ],
                    });
                    await logChannelModel.create({
                        channel: x.id,
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
