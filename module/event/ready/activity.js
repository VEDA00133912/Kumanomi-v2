const { Events, ActivityType } = require('discord.js');

module.exports = {
  name: Events.ClientReady,
  once: true,
  async execute(client) {
    client.user.setActivity(`/help || ping: 50ws`, {
      type: ActivityType.Custom, 
    });
    console.log('Activity setup is complete')
  },
};