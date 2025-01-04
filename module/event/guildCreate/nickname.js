const { Events } = require('discord.js');
const config = require('../../../file/setting/config.json'); 

module.exports = {
  name: Events.GuildCreate,
  async execute(guild) {
    try {
      const nickname = config.nickname;
      if (nickname) {
        await guild.members.me.setNickname(nickname);
        console.log(`${guild.name}でニックネームを設定しました`);
      } else {
        console.error('ニックネームが設定されていません');
      }
    } catch (error) {
      console.error(`${guild.name} - ニックネーム設定失敗`);
    }
  },
};