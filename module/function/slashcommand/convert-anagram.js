const { SlashCommandBuilder, InteractionContextType, MessageFlags } = require('discord.js');
const { convertText } = require('../../lib/convert');
const { validateMessageContent } = require('../../lib/invalidContent');
const cooldown = require('../../event/other/cooldown');
const slashcommandError = require('../../../error/slashcommand');
const { createEmbed } = require('../../lib/embed');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('anagram')
    .setDescription('文字列をアナグラムに変換します')
    .setContexts(InteractionContextType.Guild)
    .setIntegrationTypes(0)
    .addStringOption(option =>
      option.setName('text')
        .setDescription('変換するテキストを入力してください')
        .setRequired(true)
        .setMinLength(1)
        .setMaxLength(200)),

  async execute(interaction) {
    try {
      if (cooldown(this.data.name, interaction) || await validateMessageContent(interaction, interaction.options.getString('text'))) return;

      await interaction.deferReply({ flags: MessageFlags.Ephemeral });

      const convertedText = await convertText('anagram', interaction.options.getString('text'));
      const embed = createEmbed(interaction)
        .setDescription(`\`\`\`${convertedText}\`\`\``);

      await interaction.editReply({ embeds: [embed] });

    } catch (error) {
      slashcommandError(interaction.client, interaction, error);
    }
  },
};