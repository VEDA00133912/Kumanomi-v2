const { SlashCommandBuilder, InteractionContextType, MessageFlags } = require('discord.js');
const emojiZip = require('../../lib/emozip');  
const slashcommandError = require('../../../error/slashcommand');
const cooldown = require('../../event/other/cooldown');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('getemoji')
    .setDescription('サーバーの絵文字をZIPファイルとしてダウンロードします')
    .setContexts(InteractionContextType.Guild)
    .setIntegrationTypes(0),

  async execute(interaction) {
    if (cooldown(this.data.name, interaction)) return;
    await interaction.deferReply({ flags: MessageFlags.Ephemeral });

    try {
      const zipFilePath = await emojiZip.createEmojiZip(interaction.guild);  

      if (!zipFilePath) {
        return interaction.editReply('絵文字のダウンロード中にエラーが発生しました');
      }

      await interaction.editReply({
        content: 'サーバー内の絵文字をzipに変換しました',
        files: [{ attachment: zipFilePath, name: `${interaction.guild.name}-Emoji.zip` }],
      });

    } catch (error) {
      slashcommandError(interaction.client, interaction, error);
    }
  },
};