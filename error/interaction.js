const { EmbedBuilder, Colors } = require('discord.js');
const config = require('../file/setting/config.json');

module.exports = (client, interaction, error) => {
    const channelId = config.errorLogChannelId; 

    const errorEmbed = new EmbedBuilder()
        .setTitle(`Error: ${error.name}`) 
        .setColor(Colors.Red)
        .setDescription('Interaction処理中にエラーが発生しました')
        .addFields(
            { name: 'Error', value: `\`\`\`${error.message}\`\`\`` },
            { name: 'Interaction Type', value: `${interaction.type}`, inline: true },
            { name: 'Location', value: interaction.guild ? interaction.guild.name : 'DM', inline: true },
            { name: 'Time', value: new Date().toLocaleString(), inline: true }
        )
        .setFooter({ text: `Kumanomi | ${interaction.commandName}`, iconURL: client.user.displayAvatarURL() });

    const errorChannel = client.channels.cache.get(channelId);
    if (errorChannel) {
        errorChannel.send({ embeds: [errorEmbed] });
    } else {
        console.error('エラーログチャンネルが見つかりません');
    }
};