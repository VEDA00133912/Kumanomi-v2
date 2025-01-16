const { ContextMenuCommandBuilder, ApplicationCommandType } = require('discord.js');
const cooldown = require('../../event/other/cooldown');
const contextmenuError = require('../../../error/contextmenu');
const { createEmbed } = require('../../lib/embed');

module.exports = {
  data: new ContextMenuCommandBuilder()
    .setName('アイコン表示')
    .setType(ApplicationCommandType.User)
    .setIntegrationTypes(0,1),

  async execute(interaction) {
    if (cooldown(this.data.name, interaction)) return;

    await interaction.deferReply();

    try {
      const targetUser = interaction.targetUser;
      const avatarURL = (await interaction.guild?.members.fetch(targetUser.id).catch(() => null))?.displayAvatarURL({ size: 1024 }) || targetUser.displayAvatarURL({ size: 1024 });

      await interaction.editReply({
        embeds: [createEmbed(interaction).setDescription(`<@${targetUser.id}>**[のアイコン](${avatarURL})**`).setImage(avatarURL)],
      });
    } catch (error) {
      contextmenuError(interaction.client, interaction, error);
    }
  },
};
