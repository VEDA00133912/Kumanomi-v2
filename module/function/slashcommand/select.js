const { SlashCommandBuilder, EmbedBuilder, InteractionContextType, ApplicationIntegrationType } = require('discord.js');
const cooldown = require('../../event/other/cooldown');
const random = require('../../lib/selectsongs'); 

module.exports = {
  data: new SlashCommandBuilder()
    .setName('select')
    .setDescription('曲を選択します')
    .setContexts(InteractionContextType.Guild)
    .setIntegrationTypes(ApplicationIntegrationType.GuildInstall)
    .addSubcommand(subcommand =>
      subcommand
        .setName('taiko')
        .setDescription('太鼓の達人の曲をランダムに選択します')
        .addStringOption(option =>
          option.setName('action')
            .setDescription('選曲オプションを選択します')
            .setRequired(true)
            .addChoices(
              { name: '全曲', value: 'all' },
              { name: '★10', value: 'level10' },
              { name: '裏譜面のみ', value: 'edit' },
              { name: 'ポップス', value: 'pops' },
              { name: 'アニメ', value: 'anime' },
              { name: 'キッズ', value: 'kids' },
              { name: 'ボーカロイド', value: 'vocalo' },
              { name: 'バラエティ', value: 'variety' },
              { name: 'クラシック', value: 'classic' },
              { name: 'ナムコオリジナル', value: 'namco' }
            ))
        .addIntegerOption(option =>
          option.setName('count')
            .setDescription('選択する曲の数を指定します')
            .setRequired(true)
            .setMinValue(1)
            .setMaxValue(10)) 
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('maimai')
        .setDescription('maimaiの曲をランダムに選択します')
        .addStringOption(option =>
          option.setName('action')
            .setDescription('選曲オプションを選択します')
            .setRequired(true)
            .addChoices(
              { name: '全曲', value: 'all' },
              { name: 'POPS&アニメ', value: 'pops' },
              { name: 'niconico&ボーカロイド', value: 'niconico' },
              { name: '東方Project', value: 'toho' },
              { name: 'ゲーム&バラエティ', value: 'variety' },
              { name: 'maimai', value: 'maimai' },
              { name: 'オンゲキ&チュウニズム', value: 'gekichu' },
              { name: 'Re:MASTER', value: 'remaster' },
              { name: '宴会場', value: 'utage' }
            ))
        .addIntegerOption(option =>
          option.setName('count')
            .setDescription('選択する曲の数を指定します')
            .setRequired(true)
            .setMinValue(1)
            .setMaxValue(10)) 
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('chunithm')
        .setDescription('チュウニズムの曲をランダムに選択します。')
        .addStringOption(option =>
          option.setName('action')
            .setDescription('選曲オプションを選択します。')
            .setRequired(true)
            .addChoices(
              { name: '全曲', value: 'all' },
              { name: 'POPS&ANIME', value: 'pops' },
              { name: 'niconico', value: 'niconico' },
              { name: '東方Project', value: 'toho' },
              { name: 'VARIETY', value: 'variety' },
              { name: 'イロドリミドリ', value: 'irodori' },
              { name: 'ゲキマイ', value: 'gekimai' },
              { name: 'ORIGINAL', value: 'original' },
              { name: 'WORLD\'S END', value: 'we' },
              { name: 'ULTIMA', value: 'ultima' }
            ))
        .addIntegerOption(option =>
          option.setName('count')
            .setDescription('選択する曲の数を指定します')
            .setRequired(true)
            .setMinValue(1)
            .setMaxValue(10)) 
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('prsk')
        .setDescription('プロセカの曲をランダムに選択します')
        .addStringOption(option =>
          option.setName('action')
            .setDescription('選曲オプションを選択します')
            .setRequired(true)
            .addChoices(
              { name: 'MASTER', value: 'master' },
              { name: 'APPEND', value: 'append' }
            ))
        .addIntegerOption(option =>
          option.setName('count')
            .setDescription('選択する曲の数を指定します')
            .setRequired(true)
            .setMinValue(1)
            .setMaxValue(10))
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('ongeki')
        .setDescription('オンゲキの曲をランダムに選択します')
        .addStringOption(option =>
          option.setName('action')
            .setDescription('選曲オプションを選択します')
            .setRequired(true)
            .addChoices(
              { name: '全曲', value: 'all' },
              { name: 'POPS&ANIME', value: 'pops' },
              { name: 'niconico', value: 'niconico' },
              { name: '東方Project', value: 'toho' },
              { name: 'VARIETY', value: 'variety' },
              { name: 'チュウマイ', value: 'chumai' },
              { name: 'Re:MASTER', value: 'remaster' },
              { name: 'LUNATIC', value: 'lunatic' }
            ))
        .addIntegerOption(option =>
          option.setName('count')
            .setDescription('選択する曲の数を指定します')
            .setRequired(true)
            .setMinValue(1)
            .setMaxValue(10)) 
    )
    .addSubcommand(subcommand =>
        subcommand
          .setName('polaris')
          .setDescription('ポラリスコードの曲をランダムに選択します')
          .addStringOption(option =>
            option.setName('action')
              .setDescription('選曲オプションを選択します')
              .setRequired(true)
              .addChoices(
                { name: '全曲', value: 'all' },
                { name: 'POPS&アニメ', value: 'anime' },
                { name: 'ソーシャルミュージック', value: 'social' },
                { name: 'Virtual', value: 'virtual' },
                { name: '東方Project', value: 'toho' },
                { name: 'バラエティ', value: 'variety' },
                { name: 'オリジナル', value: 'original' },
                { name: 'INF譜面', value: 'inf' }
              ))
          .addIntegerOption(option =>
            option.setName('count')
              .setDescription('選択する曲の数を指定します')
              .setRequired(true)
              .setMinValue(1)
              .setMaxValue(10))
      )
      .addSubcommand(subcommand =>
        subcommand
          .setName('yumesute')
          .setDescription('ユメステの曲をランダムに選択します')
          .addStringOption(option =>
            option.setName('action')
              .setDescription('選曲オプションを選択します')
              .setRequired(true)
              .addChoices(
                { name: '全曲', value: 'all' }
              ))
          .addIntegerOption(option =>
            option.setName('count')
              .setDescription('選択する曲の数を指定します')
              .setRequired(true)
              .setMinValue(1)
              .setMaxValue(10))
      ),

  async execute(interaction) {
    const subcommand = interaction.options.getSubcommand();
    if (cooldown(`search-${subcommand}`, interaction)) return;

    const option = interaction.options.getString('action');
    const count = interaction.options.getInteger('count');
    const embedColor = subcommand === 'taiko' ? '#ff7c04' : 
                       subcommand === 'maimai' ? '#58bcf4' : 
                       subcommand === 'chunithm' ? '#fffc3c' : 
                       subcommand === 'prsk' ? '#34ccbc' : 
                       subcommand === 'ongeki' ? '#dccaf6' : 
                       subcommand === 'poralis' ? '#f7f7e3' : 
                       subcommand === 'yumesute' ? '#ff5e8f' : 
                       '#febe69'; 
    
    const loadingMessage = '<a:loading:1302169108888162334> 選曲中...';

    const embedLoading = new EmbedBuilder()
      .setDescription(loadingMessage)
      .setTimestamp()
      .setFooter({ text: `Kumanomi | select ${subcommand}`, iconURL: interaction.client.user.displayAvatarURL() })
      .setColor(embedColor);

    await interaction.reply({ embeds: [embedLoading] });

    setTimeout(async () => {
      await random.getRandomSongs(interaction, this.data.name, subcommand, option, count, embedColor);
    }, 1000); 
  },
};