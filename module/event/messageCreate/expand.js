const { EmbedBuilder, Events, Colors } = require('discord.js');
const { Expand, Blacklist } = require('../../../file/setting/mongodb');
const config = require('../../../file/setting/config.json');

module.exports = {
  name: Events.MessageCreate,
  async execute(message, client) {
    if (message.author.bot) return;

    const suspiciousPatterns = [
      /[\w-]{24}\.[\w-]{6}\.[\w-]{27}/, 
      /(discord\.com|discord\.gg|discordapp\.com|invite)/i,
      /\|{8,}/,
    ];

    const urls = message.content.match(/https:\/\/(?:canary\.|ptb\.)?discord\.com\/channels\/\d+\/\d+\/\d+/g);
    if (!urls) {
      return;
    }

    try {
      const [expandSetting, isBlacklisted] = await Promise.all([
        Expand.findOne({ guildId: message.guild.id }),
        Blacklist.exists({ userId: message.author.id, guildId: message.guild.id }),
      ]);

      if (!(expandSetting?.expand ?? true) || isBlacklisted) {
        return;
      }

      const userLinkData = message.guild.linkData || new Map();
      const now = Date.now();

      const { count = 0, timestamp = 0 } = userLinkData.get(message.author.id) || {};
      const isCooldown = now - timestamp <= 5000;
      const newCount = isCooldown ? count + 1 : 1;

      userLinkData.set(message.author.id, { count: newCount, timestamp: now });
      message.guild.linkData = userLinkData;

      if (newCount >= 3) {
        await Blacklist.create({ userId: message.author.id, guildId: message.guild.id });
        const blacklistChannel = client.channels.cache.get(config.blacklistChannelId);
        if (blacklistChannel) {
          const embed = new EmbedBuilder()
            .setColor(Colors.Red)
            .setTitle('ユーザーがブラックリストに追加されました')
            .addFields(
              { name: 'ユーザー名', value: message.author.tag, inline: true },
              { name: 'ユーザーID', value: message.author.id, inline: true }
            )
            .setThumbnail(message.author.displayAvatarURL())
            .setTimestamp();
          blacklistChannel.send({ embeds: [embed] });
        }
        return;
      }
      
      for (const url of urls) {
        const [guildId, channelId, messageId] = url.split('/').slice(-3);
        const guild = client.guilds.cache.get(guildId);
        if (!guild) continue;

        const channel = guild.channels.cache.get(channelId);
        if (!channel) continue;
        
        try {
          const fetchedMessage = await channel.messages.fetch(messageId);
          const { content, embeds, attachments, poll, author, createdTimestamp } = fetchedMessage;
          if (suspiciousPatterns.some((regex) => regex.test(content))) {
            return;
          }

          const embed = new EmbedBuilder()
            .setColor('#febe69')
            .setTimestamp(createdTimestamp)
            .setFooter({ text: 'Kumanomi | Expand', iconURL: client.user.displayAvatarURL() })
            .setAuthor({ name: author.tag, iconURL: author.displayAvatarURL() })
            .setDescription(content || null);

          if (attachments.size === 1 && attachments.first()?.contentType?.startsWith('image/')) {
            embed.setImage(attachments.first().proxyURL);
          } else if (attachments.size) {
            embed.addFields({ name: 'ファイル', value: `${attachments.size}件のファイルがあります。` });
          }
          if (embeds.length) {
            embed.addFields({ name: '埋め込み', value: `${embeds.length}件の埋め込みがあります。` });
          }
          if (poll) {
            embed.addFields({ name: '投票', value: 'このメッセージは投票です' });
          }

          await message.channel.send({ embeds: [embed] });
        } catch (error) {
          if (error.message === 'Unknown Message') continue;
          if (error.message === 'Missing Access') return;
          if (error.message === 'Missing Permissions') return;
          throw error;
        }
      }
    } catch (error) {
      console.error('エラー:', error);
    }
  },
};
