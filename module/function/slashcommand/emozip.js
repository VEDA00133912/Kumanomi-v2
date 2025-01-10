const { SlashCommandBuilder, InteractionContextType, MessageFlags } = require('discord.js');
const { downloadEmojisToZip } = require('../../lib/emozip');
const cooldown = require('../../event/other/cooldown');
const slashcommandError = require('../../../error/slashcommand');
const fs = require('fs');
const path = require('path');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('emozip')
    .setDescription('サーバーの絵文字をZIPファイルとしてダウンロードします')
    .setContexts(InteractionContextType.Guild)
    .setIntegrationTypes(0),
  
  async execute(interaction) {
    if (cooldown(this.data.name, interaction)) return;
    await interaction.deferReply({ flags: MessageFlags.Ephemeral });

    try {
      const emojis = interaction.guild.emojis.cache;

      if (emojis.size === 0) {
        return interaction.editReply({ content: '<:error:1302169165905526805> このサーバーには絵文字がありません', flags: MessageFlags.Ephemeral });
      }

      const file = await downloadEmojisToZip(interaction.guild, emojis);

      await interaction.editReply({
        content: `${interaction.guild.name}内の絵文字をzipに変換しました`,
        files: [file],
      });

      fs.unlinkSync(file);

    } catch (error) {
      slashcommandError(interaction.client, interaction, error);
    }
  }
};