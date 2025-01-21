const { Events, MessageFlags } = require('discord.js');
const ticketHandler = require('../../lib/ticket'); 

module.exports = {
  name: Events.InteractionCreate,  
  async execute(interaction) {
    if (!interaction.isButton()) return;

    try {
      if (interaction.customId === 'create') {
        await ticketHandler.createTicket(interaction);
      } else if (interaction.customId === 'del') {
        await ticketHandler.deleteTicket(interaction);
      }
    } catch (error) {
      console.error(`Error handling interaction: ${interaction.customId}`, error);
            await interaction.reply({
        content: 'チケットの処理中にエラーが発生しました',
        flags: MessageFlags.Ephemeral,
      });
    }
  },
};