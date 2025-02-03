const { SlashCommandBuilder, ChannelType, InteractionContextType, PermissionFlagsBits, MessageFlags } = require('discord.js');
const slashcommandError = require('../../../error/slashcommand');
const cooldown = require('../../event/other/cooldown');
const { validateMessageContent } = require('../../lib/invalidContent');
const { checkPermissions } = require('../../lib/permission');
const { getWebhookClient } = require('../../lib/spoofing');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('spoofing')
    .setDescription('他のユーザーになりすますコマンド')
    .setContexts(InteractionContextType.Guild)
    .setIntegrationTypes(0)
    .addUserOption(option => 
      option.setName('target').setDescription('ユーザーを指定').setRequired(true))
    .addStringOption(option => 
      option.setName('message').setDescription('送信するメッセージ').setRequired(true).setMinLength(1).setMaxLength(100))
    .addAttachmentOption(option => 
      option.setName('attachment').setDescription('送信する画像'))
    .addStringOption(option => 
      option.setName('nickname').setDescription('ニックネームを指定').setMinLength(1).setMaxLength(20)),

  async execute(interaction) {
    try {
      if (cooldown(this.data.name, interaction)) return;

      if (![ChannelType.GuildText, ChannelType.GuildVoice].includes(interaction.channel.type)) {
        return interaction.reply({ content: '<:error:1302169165905526805> このコマンドはテキストチャンネルまたはVCでのみ使用できます', flags: MessageFlags.Ephemeral });
      }      

      if (await checkPermissions(interaction, [PermissionFlagsBits.ManageWebhooks])) return;

      await interaction.reply({ content: '<a:loading:1302169108888162334> 準備中...', flags: MessageFlags.Ephemeral });

      const targetUser = interaction.options.getUser('target');
      const member = interaction.guild.members.cache.get(targetUser.id);
      const nickname = interaction.options.getString('nickname');
      const forbiddenWords = ['clyde', 'discord'];
      const displayName = nickname || member?.nickname || targetUser.username;
      
      if (forbiddenWords.some(word => displayName.toLowerCase().includes(word))) {
        return interaction.editReply({ content: '<:error:1302169165905526805> ニックネームに禁止単語が含まれているため設定できません' });
      }

      const message = interaction.options.getString('message');
      const attachment = interaction.options.getAttachment('attachment');

      if (await validateMessageContent(interaction, message, this.data.name)) return;

      const webhookClient = await getWebhookClient(interaction.channel, targetUser);
      const options = {
        content: message,
        username: displayName,
        avatarURL: targetUser.displayAvatarURL({ format: null, size: 1024 }),
        files: attachment ? [attachment] : []
      };

      await webhookClient.send(options);
      await interaction.editReply({ content: '<:check:1302169183110565958> メッセージ送信完了' });
    } catch (error) {
      await slashcommandError(interaction.client, interaction, error);
    }
  },
};