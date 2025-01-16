const { ContextMenuCommandBuilder, ApplicationCommandType, MessageFlags } = require('discord.js');
const cooldown = require('../../event/other/cooldown');
const contextMenuError = require('../../../error/contextmenu');
const { generateTotsuShi } = require('../../lib/totsu-shi');
const { validateMessageContent } = require('../../lib/invalidContent');

module.exports = {
  data: new ContextMenuCommandBuilder()
    .setName('突然の死ジェネレーター')
    .setType(ApplicationCommandType.Message)
    .setIntegrationTypes(0, 1),

  async execute(interaction) {
    const commandName = this.data.name;
    if (cooldown(commandName, interaction)) return;

    const targetMessage = interaction.targetMessage;

    if (!targetMessage.content) {
      return await interaction.reply({
        content: '<:error:1302169165905526805> テキストメッセージではありません',
        flags: MessageFlags.Ephemeral,
      });
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
