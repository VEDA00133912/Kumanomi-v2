const { SlashCommandBuilder, EmbedBuilder, InteractionContextType, MessageFlags, ApplicationIntegrationType } = require('discord.js');
const cooldown = require('../../event/other/cooldown');
const slashcommandError = require('../../../error/slashcommand');
const { generateNitroLinks } = require('../../lib/fakenitro'); 

module.exports = {
  data: new SlashCommandBuilder()
    .setName('nitro')
    .setDescription('フェイクNitroリンクを生成')
    .setContexts(InteractionContextType.Guild)
    .setIntegrationTypes(ApplicationIntegrationType.GuildInstall)
    .addStringOption(option =>
      option.setName('type')
        .setDescription('リンクの種類を選択')
        .setRequired(true)
        .addChoices(
          { name: 'Nitroギフト形式', value: 'nitro' },
          { name: 'プロモNitro形式', value: 'promo' }
        ))
    .addIntegerOption(option =>
      option.setName('count')
        .setDescription('生成する数')
        .setRequired(true)
        .setMinValue(1)
        .setMaxValue(10)),

  async execute(interaction) {
    if (cooldown(this.data.name, interaction)) return;
    try {
      await this.executeNitro(interaction);
    } catch (error) {
      await slashcommandError(interaction.client, interaction, error); 
    }
  },

  async sendLoadingEmbed(interaction, color, description) {
    const embed = new EmbedBuilder()
      .setColor(color)
      .setDescription(description)
      .setTimestamp()
      .setFooter({ text: 'Kumanomi | generating...', iconURL: interaction.client.user.displayAvatarURL() });
    try {
      await interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral });
    } catch (error) {
      await slashcommandError(interaction.client, interaction, error); 
    }
  },

  async executeNitro(interaction) {
    try {
      await this.sendLoadingEmbed(interaction, '#f47fff', '<a:loading:1302169108888162334> 生成中...');
      const quantity = interaction.options.getInteger('count');
      const type = interaction.options.getString('type');
      const nitroLinks = generateNitroLinks(quantity, type);

      const embed = new EmbedBuilder()
        .setColor('#f47fff')
        .setTimestamp()
        .setFooter({ text: 'Kumanomi | fake nitro', iconURL: interaction.client.user.displayAvatarURL() })
        .setDescription(`<a:boost:1302168991015506003> **Fake ${type === 'nitro' ? 'Nitro Gift' : 'Promo Nitro'} Links** <a:boost:1302168991015506003>\n${nitroLinks.join('\n')}`);

      await interaction.editReply({ embeds: [embed] });
    } catch (error) {
      await slashcommandError(interaction.client, interaction, error); 
    }
  },
};