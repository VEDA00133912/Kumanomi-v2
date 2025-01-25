const { ApplicationCommandType, ContextMenuCommandBuilder, AttachmentBuilder, MessageFlags, InteractionContextType, ApplicationIntegrationType } = require('discord.js');
const { MiQ } = require('makeitaquote');
const cooldown = require('../../../event/other/cooldown');
const contextmenuError = require('../../../../error/contextmenu');
const { createEmbed } = require('../../../lib/embed');
const { checkMessageContent } = require('../../../lib/content');

module.exports = {
  data: new ContextMenuCommandBuilder()
    .setName('Make it a Quote(カラー)')
    .setType(ApplicationCommandType.Message)
    .setContexts(InteractionContextType.Guild)
    .setIntegrationTypes(ApplicationIntegrationType.GuildInstall, ApplicationIntegrationType.UserInstall),

  async execute(interaction) {
    if (cooldown(this.data.name, interaction)) return;

    const targetMessage = interaction.targetMessage;
    const issues = checkMessageContent(targetMessage);
    if (issues.length > 0) {
      await interaction.reply({
        content: `**Make it a Quoteを生成できませんでした**\n生成失敗理由\n- ${issues.join('\n- ')}`,
        flags: MessageFlags.Ephemeral,
      });
      return;
    }

    await interaction.deferReply();

    const miq = new MiQ()
      .setFromMessage(targetMessage)
      .setColor(true) 
      .setWatermark(interaction.client.user.tag);

    try {
      const response = await miq.generateBeta();
      const attachment = new AttachmentBuilder(response, { name: 'miq.png' });

      const embed = createEmbed(interaction)
      .setDescription(`**[元メッセージへ飛ぶ🕊️](${targetMessage.url})**`)
      .setImage('attachment://miq.png');

      await interaction.editReply({
        embeds: [embed],
        files: [attachment],
      });
    } catch (error) {
      contextmenuError(interaction.client, interaction, error);
    }
  },
};