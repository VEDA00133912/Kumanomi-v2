const { ApplicationCommandType, ContextMenuCommandBuilder, InteractionContextType, ApplicationIntegrationType, MessageFlags, Colors } = require('discord.js');
const { translater } = require('../../lib/translate');  
const { validateMessageContent } = require('../../lib/invalidContent'); 
const { createEmbed } = require('../../lib/embed');
const contextmenuError = require('../../../error/contextmenu');
const cooldown = require('../../event/other/cooldown');
const { checkMessageContent } = require('../../lib/content');

module.exports = {
  data: new ContextMenuCommandBuilder()
    .setName('英語に翻訳')
    .setType(ApplicationCommandType.Message)
    .setContexts(InteractionContextType.Guild)
    .setIntegrationTypes(ApplicationIntegrationType.GuildInstall),

  async execute(interaction) {
    if (cooldown(this.data.name, interaction)) return;
    
    const targetMessage = interaction.targetMessage;
    if (targetMessage.content.length > 200) {
      await interaction.reply({ content: 'メッセージは200文字以下にしてください', flags: MessageFlags.Ephemeral });
      return;
    }
    
    const issues = checkMessageContent(targetMessage);
    if (issues.length > 0) {
      await interaction.reply({
        content: `**翻訳できませんでした**\n翻訳失敗理由\n- ${issues.join('\n- ')}`,
        flags: MessageFlags.Ephemeral, 
      });
      return;
    }

    if (await validateMessageContent(interaction, targetMessage.content)) return; 

    try {
      await interaction.deferReply();  
      const translatedText = await translater(targetMessage.content, '', 'en');

      if (translatedText.startsWith('エラーが発生しました')) {
        const errorEmbed = createEmbed(interaction)
          .setColor(Colors.Red) 
          .setDescription(`**翻訳エラー**\n${translatedText}`);
        await interaction.editReply({ embeds: [errorEmbed] });
        return;
      }

      const embed = createEmbed(interaction)
        .setDescription(`**翻訳しました！**\n\`\`\`\n${translatedText}\n\`\`\``);

      await interaction.editReply({ embeds: [embed] });  
    } catch (error) {
      contextmenuError(interaction.client, interaction, error);
    }
  },
};