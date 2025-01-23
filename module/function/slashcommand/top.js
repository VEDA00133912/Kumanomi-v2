const { SlashCommandBuilder, PermissionFlagsBits, InteractionContextType } = require('discord.js');
const cooldown = require('../../event/other/cooldown');
const slashcommandError = require('../../../error/slashcommand');
const { createEmbed } = require('../../lib/embed');
const { checkPermissions } = require('../../lib/permission');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('top')
    .setDescription('チャンネル内の一番最初のメッセージを取得します')
    .setContexts(InteractionContextType.Guild)
    .setIntegrationTypes(0),

  async execute(interaction) {
    if (cooldown(this.data.name, interaction)) return;

    try {
      const requiredPermissions = [
        PermissionFlagsBits.ReadMessageHistory,
      ];

      if (await checkPermissions(interaction, requiredPermissions)) return;

      await interaction.deferReply();

      const msg = await interaction.channel.messages
        .fetch({ after: '0', limit: 1 })
        .then(messages => messages.first());

      if (!msg) {
        return await interaction.editReply({
          content: '<:error:1302169165905526805> メッセージが見つかりませんでした。',
        });
      }

      const embed = createEmbed(interaction)
        .setTitle(msg.url)
        .setAuthor({ name: msg.author.displayName, iconURL: msg.author.displayAvatarURL() })
        .setDescription(`${msg.content || 'メッセージがありません'}`);

      await interaction.editReply({ embeds: [embed] });
    } catch (error) {
      if (error.code === 50001) {
        return interaction.editReply(
          '<:error:1302169165905526805> チャンネルへのアクセス権限がありません'
        );
      }
      slashcommandError(interaction.client, interaction, error);
    }
  },
};