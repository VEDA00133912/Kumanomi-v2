const { SlashCommandBuilder } = require('discord.js');
const cooldown = require('../../event/other/cooldown');
const slashcommandError = require('../../../error/slashcommand');
const { createEmbed } = require('../../lib/embed');
const apiConfig = require('../../../file/setting/api.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('5000choyen')
    .setDescription('5000兆円欲しい!!風の画像生成')
    .addStringOption(option => option.setName('top').setDescription('上部文字列').setRequired(true).setMinLength(1).setMaxLength(30))
    .addStringOption(option => option.setName('bottom').setDescription('下部文字列').setRequired(true).setMinLength(1).setMaxLength(30)),

  async execute(interaction) {
    if (cooldown(this.data.name, interaction)) return;

    try {
      await interaction.deferReply();
      const [top, bottom] = [interaction.options.getString('top'), interaction.options.getString('bottom')];
      const embed = createEmbed(interaction).setImage(`${apiConfig['5000choyen_API']}?top=${encodeURIComponent(top)}&bottom=${encodeURIComponent(bottom)}&type=png`);
      await interaction.editReply({ embeds: [embed] });
    } catch (error) {
      slashcommandError(interaction.client, interaction, error);
    }
  },
};