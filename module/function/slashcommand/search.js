const { SlashCommandBuilder, InteractionContextType, MessageFlags, ApplicationIntegrationType } = require('discord.js');
const { checkRedirect } = require('../../lib/redirect');
const { getPackageInfo } = require('../../lib/npm');
const { createEmbed } = require('../../lib/embed');
const slashcommandError = require('../../../error/slashcommand');
const cooldown = require('../../event/other/cooldown');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('search')
    .setDescription('情報を検索します')
    .setContexts(InteractionContextType.Guild)
    .setIntegrationTypes(ApplicationIntegrationType.GuildInstall)
    .addSubcommand(subcommand =>
      subcommand
        .setName('redirect')
        .setDescription('指定されたURLのリダイレクト情報を表示します')
        .addStringOption(option =>
          option.setName('url')
            .setDescription('リダイレクトをチェックするURL')
            .setRequired(true)))
    .addSubcommand(subcommand =>
      subcommand
        .setName('npm')
        .setDescription('指定されたnpmパッケージの情報を取得します')
        .addStringOption(option =>
          option.setName('package')
            .setDescription('情報を取得するパッケージ名')
            .setRequired(true))),

  async execute(interaction) {
    const subcommand = interaction.options.getSubcommand();
    
    if (cooldown(`search-${subcommand}`, interaction)) return;

    try {
      if (subcommand === 'redirect') {
        const url = interaction.options.getString('url');
        await interaction.deferReply({ flags: MessageFlags.Ephemeral });
        const redirectResult = await checkRedirect(url);

        const embed = createEmbed(interaction)
          .addFields(
            redirectResult.map((item, index) => ({
              name: `リダイレクト先 ${index + 1}`,
              value: item.url || 'アクセスできません',
              inline: false,
            }))
          );

        await interaction.editReply({ embeds: [embed] });
      }

      if (subcommand === 'npm') {
        const packageName = interaction.options.getString('package');
        await interaction.deferReply();
        const packageInfo = await getPackageInfo(packageName);

        const embed = createEmbed(interaction)
          .setTitle(`NPMパッケージ情報: ${packageInfo.name}`)
          .setURL(`https://npmjs.com/package/${packageInfo.name}`)
          .setImage('https://ul.h3z.jp/nhWmdmz0.png')
          .addFields(
            { name: '名前', value: packageInfo.name, inline:true },
            { name: '最新', value: `v${packageInfo.version}`, inline:true },
            { name: 'ライセンス', value: packageInfo.license, inline:true },
            { name: '制作者', value: packageInfo.author },
            { name: 'ホームページ', value: packageInfo.homepage || 'なし' },
            { name: 'リポジトリ', value: packageInfo.repository || 'なし' },
            { name: 'Last publish', value: packageInfo.lastPublish }
          );

        await interaction.editReply({ embeds: [embed] });
      }
    } catch (error) {
      if (error.message === '指定されたパッケージが見つかりませんでした') {
        await interaction.editReply({ content: error.message });
      } else {
        slashcommandError(interaction.client, interaction, error);
      }
    }
  },
};