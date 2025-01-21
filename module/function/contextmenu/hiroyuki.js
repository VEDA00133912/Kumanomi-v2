const { ApplicationCommandType, ContextMenuCommandBuilder, PermissionFlagsBits, MessageFlags } = require('discord.js');
const { generateAudio, deleteAudioFile } = require('../../lib/hiroyuki');
const { checkPermissions } = require('../../lib/permission'); 
const cooldown = require('../../event/other/cooldown');

module.exports = {
  data: new ContextMenuCommandBuilder()
    .setName('ひろゆきのMP3に変換')
    .setType(ApplicationCommandType.Message)
    .setIntegrationTypes(0,1),

  async execute(interaction) {
        if (cooldown(this.data.name, interaction)) return;
        const requiredPermissions = [ PermissionFlagsBits.AttachFiles ];
        if (await checkPermissions(interaction, requiredPermissions)) return;

    const messageContent = interaction.targetMessage.content;
    if (messageContent.length > 1000) {
      await interaction.reply({ content: '<:error:1302169165905526805>1000字以下にしてください。', flags: MessageFlags.Ephemeral });
      return; 
    }

    await interaction.reply({ content: '<a:hiroyuki:1331096942398410893> 生成中...', flags: MessageFlags.Ephemeral });

    try {
      const audioFilePath = await generateAudio(messageContent, interaction);
      if (audioFilePath) {
        await interaction.editReply({ content: '<:check:1302169183110565958> 生成完了！', files: [audioFilePath] });
        await deleteAudioFile(audioFilePath);
      }
    } catch (error) {
      await interaction.editReply(error.message);
    }
  },
};