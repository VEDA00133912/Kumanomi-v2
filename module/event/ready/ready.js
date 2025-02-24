const { Events, ActivityType } = require('discord.js');
const mongoose = require('mongoose');
const { resumeTimers } = require('../../lib/timer');
require('dotenv').config();

module.exports = {
  name: Events.ClientReady,
  once: true,
  async execute(client) {
    console.log(`${client.user.tag} is ready!`);
    mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('MongoDBに接続しました'))
    .catch(err => console.error('MongoDB接続エラー:', err));

    resumeTimers(client);
    console.log('Timer has been successfully restarted');

    let toggle = true; 
    const updateActivity = () => {
      if (toggle) {
        client.user.setActivity(`/help || ping: 50ws`, {
          type: ActivityType.Custom,
        });
      } else {
        const serverCount = client.guilds.cache.size;
        const memberCount = client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0);
        client.user.setActivity(`${serverCount} Server | ${memberCount} Members`, {
          type: ActivityType.Watching,
        });
      }
      toggle = !toggle; 
    };

    updateActivity();
    setInterval(updateActivity, 5000);

    console.log('Activity setup is complete');
  },
};
