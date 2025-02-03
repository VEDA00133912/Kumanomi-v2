const { EmbedBuilder, Events, Colors } = require('discord.js');
const config = require('../../../file/setting/config.json');  

module.exports = {
  name: Events.GuildDelete,
  async execute(guild, client) {
    const joinChannelId = config.joinLogChannelId; 
    const totalGuilds = client.guilds.cache.size; 

    try {
      const targetChannel = client.channels.cache.get(joinChannelId);
      const avatarURL = guild.iconURL({ size: 1024 });  

      if (targetChannel) {
        const leaveEmbed = new EmbedBuilder()
          .setTitle(`${guild.name} を脱退しました`)
          .setDescription(`現在 ${totalGuilds} サーバーに導入されています`)
          .setThumbnail(avatarURL)  
          .setFooter({ text: 'Kumanomi | leave', iconURL: client.user.displayAvatarURL() })
          .setTimestamp() 
          .setColor(Colors.Red); 

        await targetChannel.send({ embeds: [leaveEmbed] });
      }
    } catch (error) {
      console.error('脱退通知エラーです:', error);
    }
  }
};