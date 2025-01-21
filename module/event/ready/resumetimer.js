const { Events } = require('discord.js');
const { resumeTimers } = require('../../lib/timer');

module.exports = {
  name: Events.ClientReady, 
  once: true,
  async execute(client) {
    resumeTimers(client);
    console.log('Timer has been successfully restarted')
  },
};