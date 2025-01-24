const { SlashCommandBuilder, InteractionContextType, ApplicationIntegrationType } = require('discord.js');
const { translater } = require('../../lib/translate');
const { validateMessageContent } = require('../../lib/invalidContent');
const { createEmbed } = require('../../lib/embed');
const slashcommandError = require('../../../error/slashcommand');
const cooldown = require('../../event/other/cooldown');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('translate')
    .setDescription('他言語への翻訳をします')
    .setContexts(InteractionContextType.Guild)
    .setIntegrationTypes(ApplicationIntegrationType.GuildInstall)
    .addStringOption(option =>
      option.setName('text')
        .setDescription('翻訳したいテキストを入力してください')
        .setRequired(true)
        .setMinLength(1)
        .setMaxLength(200)
    )
    .addStringOption(option =>
      option.setName('language')
        .setDescription('翻訳したい言語を選択してください。')
        .setRequired(true)
        .addChoices(
          { name: '英語', value: 'en' },
          { name: '中国語', value: 'zh-cn' },
          { name: '韓国語', value: 'ko' },
          { name: 'ロシア語', value: 'ru' }
        )
    ),

  async execute(interaction) {
    if (cooldown(this.data.name, interaction)) return;

    const text = interaction.options.getString('text');
    const targetLanguage = interaction.options.getString('language');

    if (await validateMessageContent(interaction, text)) return;

    try {
      await interaction.deferReply();

      const translatedText = await translater(text, '', targetLanguage);
      const embed = createEmbed(interaction)
        .setDescription(`**翻訳しました！**\n\`\`\`\n${translatedText}\n\`\`\``);

      await interaction.editReply({ embeds: [embed] });
    } catch (error) {
      slashcommandError(interaction.client, interaction, error);
    }
  },
};