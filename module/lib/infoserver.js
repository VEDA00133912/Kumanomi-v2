const { ChannelType /*,PresenceUpdateStatus*/ } = require('discord.js');

module.exports.getServerInfo = async (guild) => {
  const textChannelsCount = guild.channels.cache.filter(c => c.type === ChannelType.GuildText).size;
  const voiceChannelsCount = guild.channels.cache.filter(c => c.type === ChannelType.GuildVoice).size;
  const categoryCount = guild.channels.cache.filter(c => c.type === ChannelType.GuildCategory).size;
  const totalChannelsCount = textChannelsCount + voiceChannelsCount + categoryCount; 
  const memberCount = guild.memberCount;
  const emojiCount = guild.emojis.cache.size;
  const bans = await guild.bans.fetch();
  const bannedCount = bans.size >= 1000 ? '1000+' : bans.size;  
  const bannerURL = guild.bannerURL({ size: 1024 });
  const roleCount = guild.roles.cache.size;
  const userCount = guild.members.cache.filter(member => !member.user.bot).size;
  const botCount = guild.members.cache.filter(member => member.user.bot).size;
  const createdAt = `${guild.createdAt.getFullYear()}/${(guild.createdAt.getMonth() + 1).toString().padStart(2, '0')}/${guild.createdAt.getDate().toString().padStart(2, '0')} ${guild.createdAt.getHours().toString().padStart(2, '0')}:${guild.createdAt.getMinutes().toString().padStart(2, '0')}:${guild.createdAt.getSeconds().toString().padStart(2, '0')}`;

  /*
  const onlineCount = guild.members.cache.filter(member => member.presence?.status === PresenceUpdateStatus.Online).size;
  const dndCount = guild.members.cache.filter(member => member.presence?.status === PresenceUpdateStatus.DoNotDisturb).size;
  const idleCount = guild.members.cache.filter(member => member.presence?.status === PresenceUpdateStatus.Idle).size;
  const offlineCount = guild.members.cache.filter(member => !member.presence || member.presence.status === PresenceUpdateStatus.Offline).size;
*/  

  return {
    textChannelsCount,
    voiceChannelsCount,
    categoryCount,
    totalChannelsCount,
    memberCount,
    bannedCount,
    emojiCount,
    bannerURL,
    roleCount,
    userCount,
    botCount,
    createdAt
    /*
    onlineCount,
    dndCount,
    idleCount,
    offlineCount,
    */
  };
};