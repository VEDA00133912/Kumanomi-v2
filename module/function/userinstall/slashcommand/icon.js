const { SlashCommandBuilder, userMention, ApplicationIntegrationType, InteractionContextType } = require('discord.js');
const cooldown = require('../../../event/other/cooldown');
const slashcommandError = require('../../../../error/slashcommand');
const { createEmbed } = require('../../../lib/embed');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('icon')
    .setDescription('アイコンを表示します')
    .setContexts(InteractionContextType.Guild)
    .setIntegrationTypes(ApplicationIntegrationType.GuildInstall, ApplicationIntegrationType.UserInstall)
    .addUserOption(option => 
      option.setName('user').setDescription('アイコンを表示したいユーザー').setRequired(true)
    ),

  async execute(interaction) {
    if (cooldown(this.data.name, interaction)) return;
    await interaction.deferReply();

    const targetUser = interaction.options.getUser('user') || interaction.user;
    try {
      const member = await interaction.guild?.members.fetch(targetUser.id).catch(() => null);
      const avatarURL = member 
        ? member.displayAvatarURL({ size: 2048 }) 
        : targetUser.displayAvatarURL({ size: 2048 });

      const embed = createEmbed(interaction)
        .setDescription(`${userMention(targetUser.id)}**[のアイコン](${avatarURL})**`)
        .setImage(avatarURL);

      await interaction.editReply({ embeds: [embed] });
    } catch (error) {
      slashcommandError(interaction.client, interaction, error);
    }
  },
};