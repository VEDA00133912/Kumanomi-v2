const { SlashCommandBuilder, InteractionContextType, MessageFlags } = require('discord.js');
const { checkRedirect } = require('../../lib/redirect');
const { createEmbed } = require('../../lib/embed');
const cooldown = require('../../event/other/cooldown');
const slashcommandError = require('../../../error/slashcommand');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('search')
    .setDescription('情報を検索します')
    .setContexts(InteractionContextType.Guild)
    .setIntegrationTypes(0)
    .addSubcommand(subcommand =>
      subcommand
        .setName('redirect')
        .setDescription('指定されたURLのリダイレクト情報を表示します')
        .addStringOption(option =>
          option.setName('url')
            .setDescription('リダイレクトをチェックするURL')
            .setRequired(true))),
  
  async execute(interaction) {
    const subcommand = interaction.options.getSubcommand();
    const url = interaction.options.getString('url');
    if (cooldown(`search-${subcommand}`, interaction)) return;

    try {
     if (subcommand === 'redirect') {
        await interaction.deferReply({ flags: MessageFlags.Ephemeral });
        const redirectResult = await checkRedirect(url);

        const embed = createEmbed(interaction)
          .addFields(
            redirectResult.map((item, index) => ({
              name: `リダイレクト先 ${index + 1}`,
              value: item.url || 'アクセスできません',
              inline: false,
            }))
          );

        await interaction.editReply({ embeds: [embed] });
      }
    } catch (error) {
      slashcommandError(interaction.client, interaction, error);
    }
  },
};