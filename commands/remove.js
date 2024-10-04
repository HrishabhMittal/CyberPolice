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
        ),
    /**@param {ChatInputCommandInteraction} i */
    async execute(i) {
        try {
            if (
                i.member.roles.highest.position >=
                i.guild.roles.cache.get(min).position
            ) {
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
