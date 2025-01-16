const { SlashCommandBuilder } = require('discord.js');
const cooldown = require('../../event/other/cooldown');
const { generateTotsuShi } = require('../../lib/totsu-shi');
const { validateMessageContent } = require('../../lib/invalidContent');
const slashcommandError = require('../../../error/slashcommand');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('totsu-shi')
    .setDescription('突然の死ジェネレーターです')
    .addStringOption(option =>
      option.setName('content')
        .setDescription('生成する内容')
        .setRequired(true)
        .setMinLength(1)
        .setMaxLength(100)
    ),

  async execute(interaction) {
    if (cooldown(this.data.name, interaction)) return;

    const input = interaction.options.getString('content');
    if (await validateMessageContent(interaction, input)) return;

    try {
      await interaction.deferReply();
      await interaction.editReply(generateTotsuShi(input));
    } catch (error) {
      slashcommandError(interaction.client, interaction, error);
    }
  },
};