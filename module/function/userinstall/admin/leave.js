const { SlashCommandBuilder, EmbedBuilder, Colors, MessageFlags, InteractionContextType, ApplicationIntegrationType } = require('discord.js');
const config = require('../../../../file/setting/config.json'); 

module.exports = {
  data: new SlashCommandBuilder()
    .setName('admin-leave')
    .setDescription('[管理者専用] 指定したサーバーからボットを退出させます')
    .setContexts(InteractionContextType.BotDM)
    .setIntegrationTypes(ApplicationIntegrationType.UserInstall)
    .addStringOption(option => 
      option.setName('guild')
        .setDescription('退出するサーバーのID')
        .setRequired(true)),

  async execute(interaction) {
    if (interaction.user.id !== config.ownerId) {
      return interaction.reply({ content: '<:error:1302169165905526805> このコマンドを実行する権限がありません', flags: MessageFlags.Ephemeral});
    }

    const guildId = interaction.options.getString('guild');
    const guild = interaction.client.guilds.cache.get(guildId);
    if (!guild) {
      return interaction.reply({ content: `<:error:1302169165905526805> ${guildId} のサーバーが見つかりませんでした`, flags: MessageFlags.Ephemeral});
    }

    const initialEmbed = new EmbedBuilder()
      .setTitle('サーバー退出コマンドが実行されました')
      .setDescription(`<a:loading:1302169108888162334> **${guild.name}** から退出中です...`)
      .setColor(Colors.Yellow)
      .setTimestamp()
      .setFooter({ text: 'Kumanomi | leaving', iconURL: interaction.client.user.displayAvatarURL() });

    const replyMessage = await interaction.reply({ embeds: [initialEmbed], ephemeral: true, fetchReply: true });

    try {
      await guild.leave();
      const successEmbed = new EmbedBuilder()
        .setTitle('サーバー退出完了')
        .setDescription(`<:check:1302169183110565958> **${guild.name}** から正常に退出しました`)
        .setColor(Colors.Green)
        .setTimestamp()
        .setFooter({ text: 'Kumanomi | leaver', iconURL: interaction.client.user.displayAvatarURL() });

      await replyMessage.edit({ embeds: [successEmbed] });
    } catch (error) {
      await interaction.reply({ content: `<:error:1302169165905526805> **${guild.name}** から退出できませんでした`, flags: MessageFlags.Ephemeral});
    }
  },
};