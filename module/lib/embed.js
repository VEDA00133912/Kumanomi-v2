const { EmbedBuilder } = require('discord.js');

module.exports = {
  createEmbed(interaction) {
    const fullCommandName = interaction.options.getSubcommand(false) 
      ? `${interaction.commandName} ${interaction.options.getSubcommand()}` 
      : interaction.commandName;

    return new EmbedBuilder()
      .setColor('#febe69')
      .setTimestamp()
      .setFooter({ 
        text: `Kumanomi | ${fullCommandName}`, 
        iconURL: interaction.client.user.displayAvatarURL() 
      });
  },
};