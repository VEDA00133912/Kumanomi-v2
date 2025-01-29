const { EmbedBuilder, Events, Colors, userMention } = require('discord.js');
const defConfig = require('../../../file/setting/url.json');  
const config = require('../../../file/setting/config.json');  

module.exports = {
  name: Events.GuildCreate,
  async execute(guild, client) {
    const totalGuilds = client.guilds.cache.size;
    const serverIconUrl = guild.iconURL() || defConfig.defaultIconUrl;
    const { tag: ownerName, id: ownerId } = await guild.fetchOwner();
    const serverCreationDate = guild.createdAt.toDateString();
    const serverMemberCount = guild.memberCount;

    let embedColor = Colors.Green, dmStatus = '成功'
    console.log(`join the ${guild.name}`);
    
    const ownerEmbed = new EmbedBuilder()
      .setTitle('Kumanomi BOTの導入ありがとうございます！')
      .setDescription(`**${guild.name}** に導入されました`)
      .addFields(
        { name: '使用方法', value: 'コマンド等の説明は **`/help`** をご覧ください' },
        { name: '問題が発生した時', value: 'なにかお困りの点、ご提案が有りましたら <@1095869643106828289> (ryo_001339) のDMかサポートサーバーでご相談ください' },
        { name: 'サポートサーバー', value: 'https://discord.gg/Ftz4Tcs8tR' }
      )
      .setThumbnail(serverIconUrl)
      .setFooter({ text: 'Kumanomi | Thanks for the introduction', iconURL: client.user.displayAvatarURL() })
      .setTimestamp()
      .setColor(embedColor);

    try {
      await (await guild.fetchOwner()).send({ embeds: [ownerEmbed] });
    } catch {
      dmStatus = '失敗';
      embedColor = Colors.Red;
    }

    const targetChannel = client.channels.cache.get(config.joinLogChannelId);
    if (targetChannel) {
      const joinEmbed = new EmbedBuilder()
        .setTitle(`${guild.name} に参加しました！`)
        .setDescription(`現在 ${totalGuilds} サーバーに導入されています`)
        .addFields(
          { name: '鯖主', value: `${userMention(ownerId)}\nユーザー名: ${ownerName}\nID: ${ownerId}` },
          { name: 'サーバー人数', value: `${serverMemberCount} 人` },
          { name: 'サーバー作成日', value: serverCreationDate },
          { name: 'DM送信ステータス', value: dmStatus }
        )
        .setThumbnail(serverIconUrl)
        .setFooter({ text: 'Kumanomi | join', iconURL: client.user.displayAvatarURL() })
        .setTimestamp()
        .setColor(embedColor);

      await targetChannel.send({ embeds: [joinEmbed] });
    } else {
      console.error('指定されたチャンネルが見つかりません。');
    }
  }
};