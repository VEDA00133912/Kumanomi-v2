const { Events, EmbedBuilder } = require('discord.js');
const config = require('../../../file/setting/config.json'); 

module.exports = {
  name: Events.MessageCreate,
  async execute(message) {
    if (message.author.bot || !message.content.startsWith(config.prefix + 'leave')) return;

    if (message.author.id !== config.ownerId) {
      return message.reply('<:error:1302169165905526805> このコマンドを実行する権限がありません');
    }

    const [_, guildId] = message.content.split(' ');
    if (!guildId) return message.reply('<:error:1302169165905526805> サーバーIDを指定してください');

    const guild = message.client.guilds.cache.get(guildId);
    if (!guild) return message.reply(`<:error:1302169165905526805> ${guildId} のサーバーが見つかりませんでした`);

    const initialEmbed = new EmbedBuilder()
      .setTitle('サーバー退出コマンドが実行されました')
      .setDescription(`<a:loading:1302169108888162334> **${guild.name}** から退出中です...`)
      .setColor('Yellow')
      .setTimestamp()
      .setFooter({ text: 'Kumanomi | leaving', iconURL: message.client.user.displayAvatarURL() });

    const replyMessage = await message.reply({ embeds: [initialEmbed] });

    try {
      await guild.leave();
      const successEmbed = new EmbedBuilder()
        .setTitle('サーバー退出完了')
        .setDescription(`<:check:1302169183110565958> **${guild.name}** から正常に退出しました`)
        .setColor('Green')
        .setTimestamp()
        .setFooter({ text: 'Kumanomi | leaver', iconURL: message.client.user.displayAvatarURL() });

      await replyMessage.edit({ embeds: [successEmbed] });
    } catch (error) {
      const errorEmbed = new EmbedBuilder()
        .setTitle('<:error:1302169165905526805> サーバー退出エラー')
        .setDescription(`**${guild.name}** から退出できませんでした`)
        .setColor('Red')
        .setTimestamp()
        .setFooter({ text: 'Kumanomi | leaveError', iconURL: message.client.user.displayAvatarURL() });

      await replyMessage.edit({ embeds: [errorEmbed] });
    }
  },
};