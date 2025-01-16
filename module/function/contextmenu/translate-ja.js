const { ApplicationCommandType, ContextMenuCommandBuilder } = require('discord.js');
const { translater } = require('../../lib/translate');  
const { validateMessageContent } = require('../../lib/invalidContent'); 
const { createEmbed } = require('../../lib/embed');
const contextmenuError = require('../../../error/contextmenu');
const cooldown = require('../../event/other/cooldown');

module.exports = {
  data: new ContextMenuCommandBuilder()
    .setName('日本語に翻訳')
    .setType(ApplicationCommandType.Message),

  async execute(interaction) {
    if (cooldown(this.data.name, interaction)) return;
    const text = interaction.targetMessage.content; 
    if (await validateMessageContent(interaction, text)) return; 

    try {
      await interaction.deferReply();  
      const translatedText = await translater(text, '', 'ja');  
      const embed = createEmbed(interaction)
        .setDescription(`**翻訳しました！**\n\`\`\`\n${translatedText}\n\`\`\``);

      await interaction.editReply({ embeds: [embed] });  
    } catch (error) {
      contextmenuError(interaction.client, interaction, error);
    }
  },
};