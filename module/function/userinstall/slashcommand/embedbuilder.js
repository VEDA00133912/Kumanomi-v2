const { SlashCommandBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, InteractionContextType, ApplicationIntegrationType } = require('discord.js');
const slashcommandError = require('../../../../error/slashcommand');
const cooldown = require('../../../event/other/cooldown');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('embedbuilder')
    .setDescription('埋め込みメッセージを作成します')
    .setContexts(InteractionContextType.Guild)
    .setIntegrationTypes(ApplicationIntegrationType.GuildInstall, ApplicationIntegrationType.UserInstall),

  async execute(interaction) {
    try {
      if (cooldown(this.data.name, interaction)) return;
      const modal = new ModalBuilder()
        .setCustomId('createEmbedModal')
        .setTitle('埋め込みを作成します');

      const titleInput = new TextInputBuilder()
        .setCustomId('titleInput')
        .setLabel('埋め込みのタイトル(必須)')
        .setStyle(TextInputStyle.Short)
        .setRequired(true)
        .setMaxLength(50); 

      const descriptionInput = new TextInputBuilder()
        .setCustomId('descriptionInput')
        .setLabel('埋め込みの内容(必須)')
        .setStyle(TextInputStyle.Paragraph)
        .setRequired(true)
        .setMaxLength(200); 

      const colorInput = new TextInputBuilder()
        .setCustomId('colorInput')
        .setLabel('埋め込みの色 [例:#00FFFF](任意)')
        .setStyle(TextInputStyle.Short)
        .setRequired(false);

      const footerInput = new TextInputBuilder()
        .setCustomId('footerInput')
        .setLabel('フッターの内容 (任意)')
        .setStyle(TextInputStyle.Short)
        .setRequired(false)
        .setMaxLength(50); 

      modal.addComponents(
        new ActionRowBuilder().addComponents(titleInput),
        new ActionRowBuilder().addComponents(descriptionInput),
        new ActionRowBuilder().addComponents(colorInput),
        new ActionRowBuilder().addComponents(footerInput)
      );

      await interaction.showModal(modal);
    } catch (error) {
      slashcommandError(interaction.client, interaction, error);
    }
  },
};