const { SlashCommandBuilder, InteractionContextType, MessageFlags } = require('discord.js');
const { convertText } = require('../../lib/convert');
const { validateMessageContent } = require('../../lib/invalidContent');
const cooldown = require('../../event/other/cooldown');
const slashcommandError = require('../../../error/slashcommand');
const { createEmbed } = require('../../lib/embed');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('backword')
    .setDescription('文字列を逆読みします')
    .setContexts(InteractionContextType.Guild)
    .setIntegrationTypes(0)
    .addStringOption(option =>
      option.setName('text')
        .setDescription('変換するテキストを入力してください')
        .setRequired(true)
        .setMinLength(1)
        .setMaxLength(200)
    ),

  async execute(interaction) {
    try {
      if (cooldown(this.data.name, interaction)) return;
      const text = interaction.options.getString('text');
      if (await validateMessageContent(interaction, text)) return;

      await interaction.deferReply({ flags: MessageFlags.Ephemeral });
      const convertedText = await convertText('backword', text); 

      const embed = createEmbed(interaction)
        .setDescription(`\`\`\`${convertedText}\`\`\``);

      await interaction.editReply({ embeds: [embed] });
    } catch (error) {
      slashcommandError(interaction.client, interaction, error);
    }
  },
};