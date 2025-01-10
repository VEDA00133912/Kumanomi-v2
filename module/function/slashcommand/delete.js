const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, MessageFlags, Colors } = require('discord.js');
const cooldown = require('../../event/other/cooldown');
const slashcommandError = require('../../../error/slashcommand');
const { checkPermissions } = require('../../lib/permission');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('delete')
    .setDescription('メッセージを削除します')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .addIntegerOption(option => 
      option.setName('count')
        .setDescription('削除するメッセージの数')
        .setMinValue(1)
        .setMaxValue(100)
        .setRequired(true)),

  async execute(interaction) {
    if (cooldown(this.data.name, interaction)) return;

    const requiredPermissions = [PermissionFlagsBits.ManageMessages, PermissionFlagsBits.ReadMessageHistory];
    if (await checkPermissions(interaction, requiredPermissions)) return;

    const count = interaction.options.getInteger('count');
    const channel = interaction.channel;

    try {
      const inProgressEmbed = new EmbedBuilder()
        .setColor(Colors.Yellow)
        .setDescription('<a:loading:1302169108888162334> 削除中...')
        .setFooter({ text: 'Kumanomi | deleting...', iconURL: interaction.client.user.displayAvatarURL() })
        .setTimestamp();

      await interaction.reply({ embeds: [inProgressEmbed], flags: MessageFlags.Ephemeral });

      const messages = await channel.messages.fetch({ limit: count });
      const twoWeeksAgo = Date.now() - 1209600000;
      const oldMessages = messages.filter(m => m.createdTimestamp < twoWeeksAgo);

      if (oldMessages.size > 0) {
        return await interaction.editReply({
          embeds: [inProgressEmbed.setTitle('削除失敗').setDescription('<:error:1299263288797827185> 2週間以上前のメッセージが削除できません。')]
        });
      }

      const deletedMessages = await channel.bulkDelete(messages, true);
      const completedEmbed = new EmbedBuilder()
        .setColor(Colors.Green)
        .setDescription(`<:check:1302169183110565958> 削除したメッセージ数: ${deletedMessages.size}`)
        .setTimestamp()
        .setFooter({ text: 'Kumanomi | deleted', iconURL: interaction.client.user.displayAvatarURL() });

      await interaction.editReply({ embeds: [completedEmbed], flags: MessageFlags.Ephemeral });

    } catch (error) {
      slashcommandError(interaction.client, interaction, error);
    }
  },
};