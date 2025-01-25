const { SlashCommandBuilder, InteractionContextType, AttachmentBuilder, ApplicationIntegrationType } = require('discord.js');
const { generateKao, generateNews, generateMono, generateInversion } = require('../../lib/canvas');
const cooldown = require('../../event/other/cooldown');
const slashcommandError = require('../../../error/slashcommand');
const { createEmbed } = require('../../lib/embed');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('generater')
    .setDescription('いろんなジェネレーター')
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
          { name: '※顔の良さでなんとかなると思っている。ジェネレータ', value: 'kao' },
          { name: '推しの顔が良すぎるジェネレータ', value: 'news' },
          { name: 'モノクロ画像ジェネレータ', value: 'mono' },
          { name: '色反転画像ジェネレータ', value: 'inversion' }
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

      let processedImageBuffer;

      if (effect === 'kao') {
        processedImageBuffer = await generateKao(attachment.url);
      } else if (effect === 'news') {
        processedImageBuffer = await generateNews(attachment.url);
      } else if (effect === 'mono') {
        processedImageBuffer = await generateMono(attachment.url);
      } else if (effect === 'inversion') {
        processedImageBuffer = await generateInversion(attachment.url);
      }

      const processedImageAttachment = new AttachmentBuilder(processedImageBuffer, { name: `${effect}.png` });

      const embed = createEmbed(interaction)
        .setDescription('完成！')
        .setImage(`attachment://${effect}.png`);

      await interaction.editReply({
        embeds: [embed],
        files: [processedImageAttachment],  
      });
    } catch (error) {
      slashcommandError(interaction.client, interaction, error);
    }
  },
};