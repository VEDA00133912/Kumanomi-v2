const { ContextMenuCommandBuilder, ApplicationCommandType, MessageFlags, InteractionContextType, ApplicationIntegrationType } = require('discord.js');
const cooldown = require('../../event/other/cooldown');
const contextMenuError = require('../../../error/contextmenu');
const { generateTotsuShi } = require('../../lib/totsu-shi');
const { validateMessageContent } = require('../../lib/invalidContent');
const { checkMessageContent } = require('../../lib/content');

module.exports = {
  data: new ContextMenuCommandBuilder()
    .setName('突然の死ジェネレーター')
    .setType(ApplicationCommandType.Message)
    .setContexts(InteractionContextType.Guild)
    .setIntegrationTypes(ApplicationIntegrationType.GuildInstall, ApplicationIntegrationType.UserInstall),

  async execute(interaction) {
    if (cooldown(this.data.name, interaction)) return;
    const targetMessage = interaction.targetMessage;
    const issues = checkMessageContent(targetMessage);
    if (issues.length > 0) {
      await interaction.reply({
        content: `**生成できませんでした**\n生成失敗理由\n- ${issues.join('\n- ')}`,
        flags: MessageFlags.Ephemeral, 
      });
      return;
    }

    if (await validateMessageContent(interaction, targetMessage.content)) return;

    if (targetMessage.content.length > 100) {
      return await interaction.reply({
        content: '<:error:1302169165905526805> メッセージが100文字を超えています',
        flags: MessageFlags.Ephemeral,
      });
    }

    try {
      await interaction.deferReply();

      const generatedText = generateTotsuShi(targetMessage.content);
      await interaction.editReply(generatedText);
    } catch (error) {
      await contextMenuError(interaction.client, interaction, error);
    }
  },
};
