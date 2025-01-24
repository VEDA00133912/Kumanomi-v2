const { SlashCommandBuilder, InteractionContextType, MessageFlags, ApplicationIntegrationType } = require('discord.js');
const cooldown = require('../../event/other/cooldown');
const slashcommandError = require('../../../error/slashcommand');
const { createEmbed } = require('../../lib/embed');
const { getUserData } = require('../../lib/infouser');
const { getServerInfo } = require('../../lib/infoserver');
const { getSystemInfo } = require('../../lib/infosystem');
const config = require('../../../file/setting/url.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('info')
    .setDescription('情報を表示します')
    .setContexts(InteractionContextType.Guild)
    .setIntegrationTypes(ApplicationIntegrationType.GuildInstall)
    .addSubcommand(subcommand =>
      subcommand
        .setName('user')
        .setDescription('ユーザー情報を表示します')
        .addUserOption(option => option.setName('target').setDescription('表示するユーザーを選択').setRequired(true)))
    .addSubcommand(subcommand =>
      subcommand
        .setName('server')
        .setDescription('サーバー情報を表示します'))
    .addSubcommand(subcommand =>
      subcommand
        .setName('system')
        .setDescription('システム情報を表示します')),

  async execute(interaction) {
    try {
      const subcommand = interaction.options.getSubcommand();
      if (cooldown(`search-${subcommand}`, interaction)) return;


      if (subcommand === 'user') {
          await interaction.deferReply();
          const targetUser = interaction.options.getUser('target');
          const userData = await getUserData(interaction, targetUser);
          const { user, avatarURL, joinedAtFormatted, createdAt, displayName, isBoosting, roleCount, nameColor, /*status,*/ bannerURL, userBadges } = userData;

          const embed = createEmbed(interaction)
              .setAuthor({ name: displayName, iconURL: avatarURL })
              .setDescription(`${user} のユーザー情報`)
              .setThumbnail(avatarURL)
              .addFields(
                  { name: '🔥 ユーザー名', value: user.tag },
                  { name: '🆔 ユーザーID', value: `${user.id}`},
                  // { name: 'ステータス', value: status, inline: true },
                  { name: '<:booster:1302168973172805642> ブースト', value: isBoosting },
                  { name: '<:user:1292675664368898049> 作成日', value: createdAt, inline: true},
                  { name: '<:join:1302169007130153001> 参加日', value: joinedAtFormatted, inline: true },
                  { name: '🔗 ロール数', value: `${roleCount}`, inline: true },
                  { name: '🎨 名前の色', value: nameColor.toUpperCase(), inline: true },
                  { name: '<:bot:1302192845490360401> アカウント', value: user.bot ? 'BOT' : 'USER', inline: true },
                  { name: '<:discord:1302168903857737760> バッジ', value: userBadges || 'なし', inline: true } 
              );

          if (bannerURL) {
              embed.setImage(bannerURL);
          }

          await interaction.editReply({ embeds: [embed] });
      } else if (subcommand === 'server') {
        await interaction.deferReply();
        const guild = interaction.guild;
        const serverIconUrl = guild.iconURL({ size: 2048 });
        const defaultIconUrl = config.defaultIconUrl;
        const thumbnailUrl = serverIconUrl || defaultIconUrl;

        const serverInfo = await getServerInfo(guild);
        if (!serverInfo) {
          throw new Error('サーバー情報の取得に失敗しました');
        }

   // const { textChannelsCount, voiceChannelsCount, categoryCount, memberCount, bannedCount, emojiCount, bannerURL, roleCount, userCount, botCount, onlineCount, dndCount, idleCount, offlineCount, createdAt } = serverInfo;
        const { textChannelsCount, voiceChannelsCount, categoryCount, totalChannelsCount, memberCount, bannedCount, emojiCount, bannerURL, roleCount, userCount, botCount, createdAt } = serverInfo;
        
        const embed = createEmbed(interaction)
          .setDescription(`**${guild.name} (${guild.id})**`)
          .setThumbnail(thumbnailUrl)
          .addFields(
            { name: '👑 鯖主', value: `<@${guild.ownerId}>` },
            { name: '<:booster:1302168973172805642> ブースト', value: `${guild.premiumSubscriptionCount} Boosts (Level ${guild.premiumTier})` },
            { name: '🚫 BANユーザー数', value: `${bannedCount} Users` },
            { name: '<:discord:1302168903857737760> チャンネル数', value: `Total: ${totalChannelsCount}\n<:text:1302169026470084711> Text: ${textChannelsCount} | <:vc:1302169041334571038> Voice: ${voiceChannelsCount} | <:category:1302169054735241236> Categories: ${categoryCount}`, inline: false },
           { name: '<:user:1302192406715961354> メンバー情報', value: `Total: ${memberCount} (User: ${userCount} | BOT: ${botCount})` },
          // { name: '<:user:1302192406715961354> メンバー情報', value: `Total: ${memberCount} (User: ${userCount} | BOT: ${botCount})\n<:online:1302168826972078131> : ${onlineCount} | <:dnd:1302168871037435914> : ${dndCount} | <:idle:1302168854541373450> : ${idleCount} | <:offline:1302168842981740617> : ${offlineCount}`, inline: false },
            { name: '🔗 ロール数', value: `${roleCount} Roles`, inline: true },
            { name: '😎 絵文字数', value: `${emojiCount} Emojis`, inline: true },
            { name: '⚙ 作成日', value: `${createdAt} <t:${Math.floor(guild.createdTimestamp / 1000)}:R>`, inline: true }
          );

        if (bannerURL) {
          embed.setImage(bannerURL);
        }

        await interaction.editReply({ embeds: [embed] });
      } else if (subcommand === 'system') {
        await interaction.deferReply({ flags: MessageFlags.Ephemeral });
          const { uptime, freemem, totalmem, cpus, arch } = getSystemInfo();

          const embed = createEmbed(interaction)
              .setTitle('システム情報')
              .addFields(
                  { name: '<:uptime:1302165509407641612> Uptime', value: `${Math.floor(uptime / 60)} 分`, inline: true },
                  { name: '<:cpu:1302165536754372649> CPU', value: `${cpus[0].model}`, inline: true },
                  { name: '<:cpu:1302165536754372649> Core', value: `${cpus.length} core`, inline: true },
                  { name: '<:arch:1302165524846739487> architecture', value: arch, inline: true},
                  { name: '<:ram:1302165546724360223> RAM', value: `${(freemem / (1024 ** 3)).toFixed(2)} GB / ${(totalmem / (1024 ** 3)).toFixed(2)} GB`, inline: true }
        );

          await interaction.editReply({ embeds: [embed] });
      }
    } catch (error) {
      slashcommandError(interaction.client, interaction, error);
    }
  }
};