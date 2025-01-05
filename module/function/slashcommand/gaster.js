const { SlashCommandBuilder, InteractionContextType, MessageFlags } = require('discord.js');
const { convertToGaster } = require('../../lib/gaster');
const { createEmbed } = require('../../lib/embed');
const slashcommandError = require('../../../error/slashcommand');
const cooldown = require('../../event/other/cooldown');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('gaster')
    .setDescription('ガスター語に変換')
    .setContexts(InteractionContextType.Guild)
    .setIntegrationTypes(0)
    .addStringOption(option =>
      option
        .setName('text')
        .setDescription('変換するテキスト (英数字+記号のみ対応)')
        .setRequired(true)
        .setMinLength(1)
        .setMaxLength(400)
    ),
  async execute(interaction) {
    if (cooldown(this.data.name, interaction)) return;
    
    await interaction.deferReply({ flags: MessageFlags.Ephemeral });

    try {
      const inputText = interaction.options.getString('text');
      const gasterText = await convertToGaster(inputText);

      const embed = createEmbed(interaction)
        .setDescription('**ガスター語 変換結果**')
        .addFields({
          name: '変換後',
          value: gasterText ? gasterText : '変換できませんでした。',
        });

      await interaction.editReply({ embeds: [embed] });

    } catch (error) {
      slashcommandError(interaction.client, interaction, error);
    }
  },
};
