const { SlashCommandBuilder, InteractionContextType, MessageFlags, ApplicationIntegrationType } = require('discord.js');
const { convertText } = require('../../lib/convert');
const { createEmbed } = require('../../lib/embed');
const slashcommandError = require('../../../error/slashcommand');
const cooldown = require('../../event/other/cooldown');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('rune')
    .setDescription('ルーン文字に変換')
    .setContexts(InteractionContextType.Guild)
    .setIntegrationTypes(ApplicationIntegrationType.GuildInstall)
    .addStringOption(option =>
      option
        .setName('text')
        .setDescription('変換するテキスト(漢字は非対応です)')
        .setRequired(true)
        .setMinLength(1)
        .setMaxLength(200)
    ),
  async execute(interaction) {
    if (cooldown(this.data.name, interaction)) return;
    
    await interaction.deferReply({ flags: MessageFlags.Ephemeral });

    try {
      const inputText = interaction.options.getString('text');
      const runeText = await convertText('rune', inputText);

      const embed = createEmbed(interaction)
             .setDescription(runeText ? runeText : '変換できませんでした')

      await interaction.editReply({ embeds: [embed] });

    } catch (error) {
      slashcommandError(interaction.client, interaction, error);
    }
  },
};