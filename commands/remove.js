const profileModel = require("../models/profileSchema");
const {
    SlashCommandBuilder,
    ChatInputCommandInteraction,
} = require("discord.js");
require("dotenv").config();
const channelModel = require("../models/logChannelSchema");
const roleModel = require("../models/roleSchema");
const { MIN_REGEX_ADDER_ROLE: min } = process.env;
module.exports = {
    data: new SlashCommandBuilder()
        .setName("remove")
        .setDescription("removes a new regex")
        .addStringOption((op) =>
            op
                .setName("regex")
                .setDescription("regex to compare messages with")
                .setRequired(true)
        ),
    /**@param {ChatInputCommandInteraction} i */
    async execute(i) {
        try {
            let manager = await roleModel.findOne({
                guildname: i.guild.id,
            });
            if (
                i.member.roles.cache.has(manager.role) ||
                i.member.id === i.guild.ownerId
            ) {
                const channel = await channelModel.findOne({
                    guildname: i.guild.id,
                });
                await i.guild.channels.cache
                    .get(channel.channel)
                    .send(`removed regex:${i.options.get("regex").value}`);
                await profileModel.findOneAndDelete({
                    expr: i.options.get("regex").value,
                    guildname: String(i.guild.id),
                });
                await i.reply("regex removed!");
            } else await i.reply("you dont have the authority to do this.");
        } catch (err) {
            console.log(`error! ${err}`);
            return;
        }
    },
};
