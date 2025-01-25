const { Events, MessageFlags } = require('discord.js');
const ticketHandler = require('../../lib/ticket');

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {
        if (!interaction.isButton()) return;

        try {
            if (interaction.customId === 'create') {
                await ticketHandler.createTicket(interaction);
                return;
            } else if (interaction.customId === 'del') {
                await ticketHandler.deleteTicket(interaction);
                return;
            }
        } catch (error) {
            console.error(error); 
            await interaction.followUp({
                content: 'エラーが発生しました',
                flags: MessageFlags.Ephemeral,
            });
        }
    },
};