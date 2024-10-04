const profileModel = require("../models/profileSchema");
const {
    SlashCommandBuilder,
    ChatInputCommandInteraction,
} = require("discord.js");
require("dotenv").config();
const { MIN_REGEX_ADDER_ROLE: min } = process.env;
module.exports = {
    data: new SlashCommandBuilder()
        .setName("list")
        .setDescription("lists all regex"),
    /**@param {ChatInputCommandInteraction} i */
    async execute(i) {
        try {
            let reply = "LIST OF ALL REGEX:\n";
            let list = await profileModel.find({
                guildname: i.guild.id,
            });
            for (let i of list) {
                reply +=
                    "comparing with regex: /" +
                    i.expr +
                    "/ with severity: " +
                    i.level +
                    "\n";
            }
            i.reply(reply);
        } catch (err) {
            console.log(`error! ${err}`);
            return;
        }
    },
};
