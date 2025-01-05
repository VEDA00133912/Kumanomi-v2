const { Events } = require('discord.js');

module.exports = {
  name: Events.GuildDelete,
  async execute(guild) {
    console.log(`Left a server: ${guild.name}`);
  },
};