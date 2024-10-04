const { Events } = require("discord.js");

module.exports = {
    name: Events.ClientReady,
    once: true,
    execute(cl) {
        console.log(`${cl.user.tag} is ready!`);
    },
};
