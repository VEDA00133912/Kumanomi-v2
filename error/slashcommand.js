const { EmbedBuilder, DiscordAPIError, Colors, MessageFlags } = require('discord.js');
const config = require('../file/setting/config.json');

module.exports = async function handleSlashcommandError(client, interaction, error) {
    const commandId = interaction.commandId; 
    const errorMessage = `<:error:1302169165905526805> </${interaction.commandName}:${commandId}> の実行中にエラーが発生しました。`;

    try {
        if (error instanceof DiscordAPIError && error.code === 10062) {
            const msg = await interaction.channel?.send({ content: errorMessage });
            setTimeout(() => msg?.delete().catch(console.error), 5000);
        } else {
            const replyMethod = interaction.deferred || interaction.replied ? 'followUp' : 'reply';
            await interaction[replyMethod]({ content: errorMessage, flags: MessageFlags.Ephemeral });
        }
    } catch (notificationError) {
        console.error('エラー通知の送信に失敗しました:', notificationError);
    }

    const errorEmbed = new EmbedBuilder()
        .setTitle(`Error: ${error.name}`)
        .setColor(Colors.Red)
        .setDescription(errorMessage)
        .addFields(
            { name: 'Error', value: `\`\`\`${error.message}\`\`\`` },
            { name: 'Command', value: interaction.commandName, inline: true },
            { name: 'Server', value: interaction.guild?.name || 'DM', inline: true },
            { name: 'Channel', value: interaction.channel?.name || 'DM', inline: true }
        )
        .setTimestamp()
        .setFooter({ text: 'Kumanomi | Error - slashcommand', iconURL: client.user.displayAvatarURL() });

    try {
        const errorChannel = client.channels.cache.get(config.errorLogChannelId);
        if (errorChannel) {
            await errorChannel.send({ embeds: [errorEmbed] });
        } else {
            return;
        }
    } catch (logError) {
        return;
    }

    console.error(`/${interaction.commandName}実行中にエラーが発生しました:`, error);
};
