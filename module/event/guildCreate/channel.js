const { Events } = require('discord.js');

module.exports = {
  name: Events.GuildCreate,
  async execute(guild) {
    console.log(`Joined a new server with ID: ${guild.id}`);
  },
};