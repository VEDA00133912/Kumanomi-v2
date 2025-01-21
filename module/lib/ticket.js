const { EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, PermissionFlagsBits, MessageFlags, Colors } = require('discord.js');

module.exports = {
  async createTicket(interaction) {
    const mid = interaction.user.id;
    const guild = interaction.guild;

    const existingChannel = guild.channels.cache.find(tic => tic.name === `チケット-${mid}`);
    if (existingChannel) {
      return await interaction.reply({
        content: `<:error:1299263288797827185> 既に作成済です\nhttps://discord.com/channels/${guild.id}/${existingChannel.id}`,
        flags: MessageFlags.Ephemeral,
      });
    }

    const channel = await guild.channels.create({
      name: `チケット-${mid}`,
      reason: `Created By : ${interaction.user.username}`,
      permissionOverwrites: [
        {
          id: guild.roles.everyone,
          deny: [PermissionFlagsBits.ViewChannel],
        },
        {
          id: interaction.user.id,
          allow: [
            PermissionFlagsBits.ViewChannel,
            PermissionFlagsBits.SendMessages,
            PermissionFlagsBits.AttachFiles,
            PermissionFlagsBits.ReadMessageHistory,
          ],
        },
        {
          id: interaction.client.user.id,
          allow: [
            PermissionFlagsBits.ViewChannel,
            PermissionFlagsBits.SendMessages,
            PermissionFlagsBits.EmbedLinks,
          ],
        },
      ],
    });

    await interaction.reply({
      content: `<:done:1299263286361063454> **作成しました**\nhttps://discord.com/channels/${guild.id}/${channel.id}`,
      flags: MessageFlags.Ephemeral,
    });

    const embed = new EmbedBuilder()
      .setColor(Colors.R)
      .setTimestamp()
      .setFooter({ text:'Emubot | ticket delete', iconURL: interaction.client.user.displayAvatarURL() })
      .setDescription(`<<:done:1299263286361063454> **チケットを作成しました。**\n削除する場合は下のボタンを押してください`);

    const del = new ButtonBuilder()
      .setCustomId('del')
      .setStyle(ButtonStyle.Danger)
      .setLabel('削除');

    await channel.send({
      embeds: [embed],
      components: [new ActionRowBuilder().addComponents(del)],
    });
  },

  async deleteTicket(interaction) {
    const mid = interaction.user.id;
    const channel = interaction.channel;
    const channelCreatorId = channel.name.split('-')[1];

    if (mid !== channelCreatorId) {
      return await interaction.reply({
        content: '<:error:1299263288797827185> あなたは作成者ではありません',
        flags: MessageFlags.Ephemeral,
      });
    }

    await channel.delete();
  },
};