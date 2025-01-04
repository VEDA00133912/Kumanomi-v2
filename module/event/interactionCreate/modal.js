const { Events, EmbedBuilder, MessageFlags } = require('discord.js');
const { validateMessageContent } = require('../../lib/invalidContent');

module.exports = {
  name: Events.InteractionCreate,
  async execute(interaction) {
    if (!interaction.isModalSubmit()) return;

    if (interaction.customId === 'createEmbedModal') {
      try {
        const title = interaction.fields.getTextInputValue('titleInput');
        const description = interaction.fields.getTextInputValue('descriptionInput');
        const color = interaction.fields.getTextInputValue('colorInput') || '#febe69';
        const footer = interaction.fields.getTextInputValue('footerInput') || 'Kumanomi | embedbuilder';

        if (await validateMessageContent(interaction, title, 'createembed')) return;
        if (await validateMessageContent(interaction, description, 'createembed')) return;
        if (footer && await validateMessageContent(interaction, footer, 'createembed')) return;

        const embed = new EmbedBuilder()
          .setTitle(title)
          .setDescription(description)
          .setColor(color) 
          .setTimestamp()
          .setFooter({ text: footer });

        await interaction.reply({ embeds: [embed] });
      } catch (error) {
        if (error.code === 'ColorConvert') {
          await interaction.reply({
            content: '<:error:1302169165905526805> カラーコードが無効です',
            flags: MessageFlags.Ephemeral,
          });
        } else {
          console.error('Error creating embed:', error);
          await interaction.reply({
            content: '<:error:1302169165905526805> 埋め込みの作成に失敗しました。',
            flags: MessageFlags.Ephemeral,
          });
        }
      }
    }
  },
};