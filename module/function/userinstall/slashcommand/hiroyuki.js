const { SlashCommandBuilder, MessageFlags, ApplicationIntegrationType, InteractionContextType } = require('discord.js');
const { generateAudio, deleteAudioFile } = require('../../../lib/hiroyuki');
const cooldown = require('../../../event/other/cooldown');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('hiroyuki')
    .setDescription('ひろゆきボイスのMP3に変換します')
    .setContexts(InteractionContextType.Guild)
    .setIntegrationTypes(ApplicationIntegrationType.GuildInstall, ApplicationIntegrationType.UserInstall)
    .addStringOption(option =>
      option.setName('text')
        .setDescription('ひろゆきに喋らせる内容')
        .setRequired(true)
        .setMinLength(1)
        .setMaxLength(1000)),

  async execute(interaction) {
    if (cooldown(this.data.name, interaction)) return;
      
    const text = interaction.options.getString('text');
    await interaction.reply({ content: '<a:hiroyuki:1331096942398410893> 生成中...', flags: MessageFlags.Ephemeral });

    try {
      const audioFilePath = await generateAudio(text, interaction);
      if (audioFilePath) {
        await interaction.editReply({ content: '<:check:1302169183110565958> 生成完了！', files: [audioFilePath] });
        await deleteAudioFile(audioFilePath);
      }
    } catch (error) {
      console.error(error.message);
      await interaction.editReply(error.message);
    }
  },
};