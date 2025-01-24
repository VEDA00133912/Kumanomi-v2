const { SlashCommandBuilder, InteractionContextType, MessageFlags, ApplicationIntegrationType } = require('discord.js');
const { convertText } = require('../../lib/convert');
const { createEmbed } = require('../../lib/embed');
const slashcommandError = require('../../../error/slashcommand');
const cooldown = require('../../event/other/cooldown');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('gaster')
    .setDescription('ガスター語に変換')
    .setContexts(InteractionContextType.Guild)
    .setIntegrationTypes(ApplicationIntegrationType.GuildInstall)
    .addStringOption(option =>
      option
        .setName('text')
        .setDescription('変換するテキスト (英数字+記号のみ対応)')
        .setRequired(true)
        .setMinLength(1)
        .setMaxLength(200)
    ),
  async execute(interaction) {
    if (cooldown(this.data.name, interaction)) return;
    
    await interaction.deferReply({ flags: MessageFlags.Ephemeral });

    try {
      const inputText = interaction.options.getString('text');
      const gasterText = await convertText('gaster', inputText);

      const embed = createEmbed(interaction)
             .setDescription(gasterText ? gasterText : '変換できませんでした。')

      await interaction.editReply({ embeds: [embed] });

    } catch (error) {
      slashcommandError(interaction.client, interaction, error);
    }
  },
};