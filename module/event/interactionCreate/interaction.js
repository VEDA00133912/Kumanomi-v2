const { Events } = require('discord.js');

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction, client) {
        if (interaction.isCommand()) {
            try {
                const command = client.commands.get(interaction.commandName);
                if (!command) return;
                await command.execute(interaction, client);
            } catch (error) {
                console.error('Error handling slash command interaction:', error);
                interactionError(client, interaction, error);
            }
        } else if (interaction.isContextMenuCommand()) {
            try {
                const command = client.commands.get(interaction.commandName);
                if (!command) return;
                await command.execute(interaction, client);
            } catch (error) {
                console.error('Error handling context menu interaction:', error);
                interactionError(client, interaction, error);
            }
        }
    },
};