const { ApplicationCommandType, ContextMenuCommandBuilder, AttachmentBuilder, MessageFlags, ButtonBuilder, ActionRowBuilder, ButtonStyle, PermissionFlagsBits, InteractionContextType, ApplicationIntegrationType } = require('discord.js');
const { MiQ } = require('makeitaquote');
const cooldown = require('../../event/other/cooldown');
const contextmenuError = require('../../../error/contextmenu');
const { createEmbed } = require('../../lib/embed');
const { checkMessageContent } = require('../../lib/content');

module.exports = {
  data: new ContextMenuCommandBuilder()
    .setName('Make it a Quote')
    .setType(ApplicationCommandType.Message)
    .setContexts(InteractionContextType.Guild)
    .setIntegrationTypes(ApplicationIntegrationType.GuildInstall),

  async execute(interaction) {
    if (cooldown(this.data.name, interaction)) return;

    const targetMessage = interaction.targetMessage;
    const issues = checkMessageContent(targetMessage);
    if (issues.length > 0) {
      await interaction.reply({
        content: `**Make it a Quoteを生成できませんでした**\n生成失敗理由\n- ${issues.join('\n- ')}`,
        flags: MessageFlags.Ephemeral,
      });
      return;
    }

    await interaction.deferReply();

    const miq = new MiQ()
      .setFromMessage(targetMessage)
      .setColor(false) 
      .setWatermark(interaction.client.user.tag);

    try {
      const response = await miq.generateBeta();
      const attachment = new AttachmentBuilder(response, { name: 'miq.png' });

      const embed = createEmbed(interaction)
      .setDescription(`**[元メッセージへ飛ぶ🕊️](${targetMessage.url})**`)
      .setImage('attachment://miq.png');

      const colorButto = new ButtonBuilder()
        .setCustomId(`miq-${targetMessage.id}-${targetMessage.author.id}-${interaction.id}-false`) 
        .setEmoji('<a:hiroyuki:1331895832454238258>')
        .setStyle(ButtonStyle.Primary);

      const row = new ActionRowBuilder().addComponents(colorButto);

      await interaction.editReply({
        embeds: [embed],
        files: [attachment],
        components: [row],
      });
      
      const sentMessage = await interaction.fetchReply();
      
      const colorButton = new ButtonBuilder()
        .setCustomId(`miq-${targetMessage.id}-${targetMessage.author.id}-${sentMessage.id}-false`) 
        .setEmoji('<a:hiroyuki:1331895832454238258>')
        .setStyle(ButtonStyle.Primary);
      
      const updatedRow = new ActionRowBuilder().addComponents(colorButton);
      
      await sentMessage.edit({
        components: [updatedRow],
      });
      
    } catch (error) {
      contextmenuError(interaction.client, interaction, error);
    }
  },
};