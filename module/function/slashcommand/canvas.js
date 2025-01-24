const { SlashCommandBuilder, InteractionContextType, AttachmentBuilder, ApplicationIntegrationType } = require('discord.js');
const { generateMeme } = require('../../lib/canvas');
const cooldown = require('../../event/other/cooldown');
const slashcommandError = require('../../../error/slashcommand');
const { createEmbed } = require('../../lib/embed');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('canvas')
    .setDescription('画像加工を行います')
    .setContexts(InteractionContextType.Guild)
    .setIntegrationTypes(ApplicationIntegrationType.GuildInstall)
    .addAttachmentOption(option =>
      option.setName('image')
        .setDescription('画像をアップロードしてください')
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName('effect')
        .setDescription('画像効果を選択してください')
        .setRequired(true)
        .addChoices(
          { name: '顔の良さでなんとかなると思っているジェネレータ', value: 'meme' }
        )
    ),

  async execute(interaction) {
    try {
      const commandName = this.data.name;
      const effect = interaction.options.getString('effect');

      if (cooldown(commandName, interaction)) return;
      await interaction.deferReply();

      const attachment = interaction.options.getAttachment('image');
      if (!attachment || !attachment.url || !attachment.contentType?.startsWith('image/') || attachment.contentType === 'image/gif') {
        await interaction.editReply({
          content: '<:error:1302169165905526805> 画像をアップロードしてください',
        });
        return;
      }

      if (effect === 'meme') {
        const memeBuffer = await generateMeme(attachment.url);
        const memeAttachment = new AttachmentBuilder(memeBuffer, { name: 'kaoyoshi.png' });

        const embed = createEmbed(interaction)
          .setDescription('完成！')
          .setImage('attachment://kaoyoshi.png');

        await interaction.editReply({
          embeds: [embed],
          files: [memeAttachment],  
        });
      } else {
        await interaction.editReply({
          content: '<:error:1302169165905526805> 無効な効果が選択されました。',
        });
      }
    } catch (error) {
      slashcommandError(error, interaction);
    }
  },
};