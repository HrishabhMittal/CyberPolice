const profileModel = require("../models/profileSchema");
const {
    SlashCommandBuilder,
    ChatInputCommandInteraction,
} = require("discord.js");
require("dotenv").config();
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
        )
        .addIntegerOption((op) =>
            op
                .setName("severity")
                .setDescription(
                    "mention severity of regex matching (low(1)-high(3))"
                )
                .setRequired(true)
        ),
    /**@param {ChatInputCommandInteraction} i */
    async execute(i) {
        try {
            if (
                i.member.roles.highest.position >=
                i.guild.roles.cache.get(min).position
            ) {
                profileModel.findOneAndDelete({
                    level: i.options.get("severity").value,
                    guildname: String(i.guild.id),
                    expr: i.options.get("regex").value,
                });
                await i.reply("regex removed!");
            } else await i.reply("you dont have the authority to do this.");
        } catch (err) {
            console.log("error!");
            return;
        }
    },
};
