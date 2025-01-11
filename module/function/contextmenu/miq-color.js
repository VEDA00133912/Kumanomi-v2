const { ApplicationCommandType, ContextMenuCommandBuilder, AttachmentBuilder } = require('discord.js');
const { MiQ } = require('makeitaquote');
const cooldown = require('../../event/other/cooldown');
const contextmenuError = require('../../../error/contextmenu');
const { createEmbed } = require('../../lib/embed');

module.exports = {
  data: new ContextMenuCommandBuilder()
    .setName('Make it a Quote')
    .setType(ApplicationCommandType.Message),

  async execute(interaction) {
    if (cooldown(this.data.name, interaction)) return;

    await interaction.deferReply();
        const msg = interaction.targetMessage;
        const miq = new MiQ()
        .setFromMessage(msg)
        .setColor(true)
        .setWatermark(interaction.client.user.username);

    try {
      const response = await miq.generateBeta();
      const attachment = new AttachmentBuilder(response, { name: 'miq.png' });

      const embed = createEmbed(interaction)
        .setDescription(`**[元メッセージへ飛ぶ🕊️](${msg.url})**`)
        .setImage('attachment://miq.png');

      await interaction.editReply({ embeds: [embed], files: [attachment] });
    } catch (error) {
      contextmenuError(interaction.client, interaction, error);
    }
  },
};