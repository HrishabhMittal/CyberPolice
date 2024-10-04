module.exports = async (token, clientId, guildId) => {
    const { REST, Routes } = require("discord.js");
    const fs = require("node:fs");
    const commands = [];
    const commandFiles = fs
        .readdirSync("./commands")
        .filter((file) => file.endsWith(".js"));
    for (const file of commandFiles) {
        const command = require(`../commands/${file.slice(
            0,
            file.length - 3
        )}`);
        commands.push(command.data.toJSON());
    }
    const rest = new REST({ version: "10" }).setToken(token);
    try {
        const data = await rest.put(
            Routes.applicationGuildCommands(clientId, guildId),
            { body: commands }
        );
    } catch (error) {
        console.error(error);
    }
};
