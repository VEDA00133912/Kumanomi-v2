const { Events, ActivityType } = require('discord.js');

module.exports = {
  name: Events.ClientReady,
  once: true,
  async execute(client) {
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