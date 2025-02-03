const { EmbedBuilder, Events, Colors, MessageType, ChannelType, userMention } = require('discord.js');
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
        const channel = client.guilds.cache.get(guildId)?.channels.cache.get(channelId);

        try {
          const fetchedMessage = await channel.messages.fetch(messageId);
          const { content, embeds, attachments, poll, author, createdTimestamp, type } = fetchedMessage;
          const messageTypeResponses = {
      [MessageType.GuildBoostTier1]: `<:1_Level_Boost:1335166424909479996> ${message.guild.name} が **レベル1 を達成しました！**`,
      [MessageType.GuildBoostTier2]: `<:2_Level_Boost:1335166412234424330> ${message.guild.name} が **レベル2 に到達しました！**`,
      [MessageType.GuildBoostTier3]: `<:3_Level_Boost:1335166399299059722> ${message.guild.name} が **レベル3 に到達しました！**`,
      [MessageType.GuildBoost]: `<:Community_Server_Boost:1335164321466159124> ${userMention(fetchedMessage.author.id)}がサーバーをブーストしました！`,
      [MessageType.ChannelFollowAdd]: `<:News:1335164921297506385> ${fetchedMessage.author.globalName}が**${fetchedMessage.content}**をこのチャンネルに追加しました。 大切な更新がここに表示されます。`,
      [MessageType.AutoModerationAction]: '<:automod:1335157547467935764> Automodが実行されました',
      [MessageType.ChannelPinnedMessage]: `<:Pinned_New:1335164950292856883> ${fetchedMessage.author.globalName}がメッセージをチャンネルにピン留めしました`,
      [MessageType.PollResult]: `<:Polls:1335166384795287603> ${fetchedMessage.author.globalName}の投票が終了しました`,
      [MessageType.UserJoin]: `<:NewMember_Chat:1335165371313029171> ${userMention(fetchedMessage.author.id)}が参加しました！`,
      [MessageType.StageStart]: `<:stage:1335408262123880509> ${fetchedMessage.author.globalName}が**${fetchedMessage.content}**を開始しました`,
      [MessageType.StageEnd]: `<:stageend:1335408285028712519> ${fetchedMessage.author.globalName}が**${fetchedMessage.content}**を終了しました`,
    };
          
          if (type in messageTypeResponses) {
            const embed = new EmbedBuilder()
              .setColor(Colors.Blue)
              .setDescription(messageTypeResponses[type])
              .setFooter({ text: 'Kumanomi | Expand', iconURL: client.user.displayAvatarURL() })
              .setTimestamp();
            return message.channel.send({ embeds: [embed] });
          }

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
          if (error.message === 'Unknown Message') return;
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