const { SlashCommandBuilder, MessageFlags, InteractionContextType, ApplicationIntegrationType } = require('discord.js');
const cooldown = require('../../event/other/cooldown');
const slashcommandError = require('../../../error/slashcommand');
const { createEmbed } = require('../../lib/embed');
const { isValidUrl, invalidUrlMessage } = require('../../lib/url'); 
const config = require('../../../file/setting/url.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('qr')
    .setDescription('QRコードの生成を行います')
    .setContexts(InteractionContextType.Guild)
    .setIntegrationTypes(ApplicationIntegrationType.GuildInstall)
    .addStringOption(option =>
      option.setName('url')
        .setDescription('QRに変換したいURLを入力してください')
        .setRequired(true)
    ),

  async execute(interaction) {
    if (cooldown(this.data.name, interaction)) return;

    await interaction.deferReply({ flags: MessageFlags.Ephemeral });
    try {
      const url = interaction.options.getString('url');

      if (!isValidUrl(url)) {
        await interaction.editReply({
          content: invalidUrlMessage(), 
          flags: MessageFlags.Ephemeral,
        });
        return;
      }

      const qrApiUrl = `${config.qr_API}?data=${encodeURIComponent(url)}&size=200x200`;

      const embed = createEmbed(interaction)
        .setTitle('<:check:1302169183110565958> QRコードにしました！')
        .addFields({ name: 'URL', value: url })
        .setImage(qrApiUrl);

      await interaction.editReply({
        embeds: [embed],
        flags: MessageFlags.Ephemeral,
      });
    } catch (error) {
      slashcommandError(interaction.client, interaction, error);
    }
  },
};