const { SlashCommandBuilder, MessageFlags } = require('discord.js');
const crypto = require('crypto');
const cooldown = require('../../event/other/cooldown');
const slashcommandError = require('../../../error/slashcommand');
const { createEmbed } = require('../../lib/embed');
module.exports = {
  data: new SlashCommandBuilder()
    .setName('hash')
    .setDescription('テキストをハッシュ化します')
    .addStringOption(option =>
      option.setName('text')
        .setDescription('ハッシュ化したいテキスト')
        .setRequired(true)
        .setMinLength(1)
        .setMaxLength(400)),
        
  async execute(interaction) {
    try {
      if (cooldown(this.data.name, interaction)) return;
      await interaction.deferReply({ flags: MessageFlags.Ephemeral });

      const text = interaction.options.getString('text');
      const hash = crypto.createHash('sha256').update(text).digest('hex');

      const embed = createEmbed(interaction)
      .setDescription(`ハッシュ化しました！\n\`\`\`${hash}\`\`\``)
      await interaction.editReply({
        embeds: [embed],
      });
    } catch (error) {
      slashcommandError(interaction.client, interaction, error);
    }
  },
};