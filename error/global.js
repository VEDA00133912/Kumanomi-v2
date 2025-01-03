const { EmbedBuilder, Colors } = require('discord.js');
const config = require('../file/setting/config.json');

async function sendErrorLog(client, error, errorType) {
  const channelId = config.errorLogChannelId; 
  const errorEmbed = new EmbedBuilder()
    .setTitle(`Error: ${errorType}`)
    .setColor(Colors.Red)
    .setDescription('アプリケーションで予期せぬエラーが発生しました')
    .addFields(
      { name: 'Error', value: `\`\`\`${error.message || error}\`\`\`` },
      { name: 'Type', value: errorType, inline: true },
      { name: 'Time', value: new Date().toLocaleString(), inline: true }
    )
    .setFooter({ text: `Kumanomi | ${errorType}`, iconURL: 'https://ul.h3z.jp/RbnGEYZV.png' });

  const errorChannel = client.channels.cache.get(channelId);
  if (errorChannel) {
    await errorChannel.send({ embeds: [errorEmbed] });
  } else {
    console.error('エラーログチャンネルが見つかりません');
  }
}

module.exports = (client) => {
  process.on('uncaughtException', async (err) => {
    console.error('Uncaught Exception:', err);
    await sendErrorLog(client, err, 'uncaughtException');
  });

  process.on('unhandledRejection', async (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    await sendErrorLog(client, reason, 'unhandledRejection');
  });
};