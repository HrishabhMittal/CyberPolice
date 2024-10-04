require("dotenv").config();
const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const { GatewayIntentBits, Client, Collection } = require("discord.js");
const cl = new Client({
    intents: [
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.Guilds,
        GatewayIntentBits.MessageContent,
    ],
});

const evpath = path.join(__dirname, "events");
const evfiles = fs.readdirSync(evpath).filter((file) => file.endsWith(".js"));

for (const file of evfiles) {
    const fpath = path.join(evpath, file);
    const event = require(fpath);
    if (event.once) {
        cl.once(event.name, (...args) => {
            event.execute(...args);
        });
    } else {
        cl.on(event.name, (...args) => {
            event.execute(...args);
        });
    }
}
cl.commands = new Collection();
const cpath = path.join(__dirname, "commands");
const cfiles = fs.readdirSync(cpath).filter((file) => file.endsWith(".js"));

for (const file of cfiles) {
    const fpath = path.join(cpath, file);
    const command = require(fpath);
    if ("data" in command && "execute" in command) {
        cl.commands.set(command.data.name, command);
    } else {
        console.log(
            `[WARNING] the command at ${fpath} is missing "data" or "execute" fields`
        );
    }
}

cl.login(process.env.TOKEN);
mongoose
    .connect(process.env.DB)
    .then(() => {
        console.log("connected to mongoDB");
    })
    .catch((err) => {
        console.error(err);
    });
