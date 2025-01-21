const { SlashCommandBuilder, InteractionContextType } = require('discord.js');
const slashcommandError = require('../../../error/slashcommand');
const { saveTimer, startTimer } = require('../../lib/timer');
const cooldown = require('../../event/other/cooldown');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('timer')
    .setDescription('指定した時間後に通知するタイマーを起動します。')
    .setContexts(InteractionContextType.Guild)
    .addIntegerOption(option =>
      option.setName('minutes')
        .setDescription('分を指定してください。')
        .setRequired(true)
        .setMinValue(0)
        .setMaxValue(60)
    )
    .addIntegerOption(option =>
      option.setName('seconds')
        .setDescription('秒を指定してください。')
        .setRequired(false)
        .setMinValue(0)
        .setMaxValue(60)
    ),

  async execute(interaction) {
    try {
      if (cooldown(this.data.name, interaction)) return;

      const minutes = interaction.options.getInteger('minutes');
      const seconds = interaction.options.getInteger('seconds') || 0;
      const totalSeconds = (minutes * 60) + seconds;

      await interaction.reply(`⏰️ タイマーを ${minutes} 分 ${seconds} 秒で設定します`);
      saveTimer(interaction.user.id, interaction.channel.id, totalSeconds);
      startTimer(interaction, minutes, seconds, totalSeconds);
    } catch (error) {
      slashcommandError(interaction.client, interaction, error);
    }
  },
};