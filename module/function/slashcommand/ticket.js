const { SlashCommandBuilder, InteractionContextType, ButtonBuilder, ButtonStyle, ActionRowBuilder, PermissionFlagsBits, ApplicationIntegrationType } = require('discord.js');
const slashcommandError = require('../../../error/slashcommand');
const cooldown = require('../../event/other/cooldown');
const { createEmbed } = require('../../lib/embed');
const { checkPermissions } = require('../../lib/permission');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ticket')
    .setDescription('チケットを作成します')
    .setContexts(InteractionContextType.Guild)
    .setIntegrationTypes(ApplicationIntegrationType.GuildInstall)
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),

  async execute(interaction) {
    try {
      if (cooldown(this.data.name, interaction)) return;

        const requiredPermissions = [ PermissionFlagsBits.ManageChannels ];
        if (await checkPermissions(interaction, requiredPermissions)) return;

      const create = new ButtonBuilder()
        .setCustomId('create')
        .setStyle(ButtonStyle.Primary)
        .setLabel('チケットを作成する');

      const embed = createEmbed(interaction)
        .setDescription('チケットを作成するには下のボタンを押してください');

      const button = new ActionRowBuilder()
        .addComponents(create);

      await interaction.reply({
        embeds: [embed],
        components: [button],
      });
    } catch (error) {
      slashcommandError(interaction.client, interaction, error);
    }
  },
};