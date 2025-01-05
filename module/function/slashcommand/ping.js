const { SlashCommandBuilder, InteractionContextType } = require('discord.js');
const cooldown = require('../../event/other/cooldown');
const slashcommandError = require('../../../error/slashcommand');
const { createEmbed } = require('../../lib/embed');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Ping値を測定します。')
    .setContexts(InteractionContextType.Guild)
    .setIntegrationTypes(0),

  async execute(interaction) {
    if (cooldown(this.data.name, interaction)) return;

    try {
      const embed = createEmbed(interaction)
        .setDescription('Pong！🏓')
        .addFields(
          { name: 'WebSocket Ping', value: `${interaction.client.ws.ping}ms`, inline: true },
          { name: 'API-Endpoint Ping', value: `${Date.now() - interaction.createdTimestamp}ms`, inline: true }
        );

      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      slashcommandError(interaction.client, interaction, error);
    }
  },
};