/*const { PresenceUpdateStatus } = require('discord.js');*/
const badges = require('../../file/setting/badges.js');
const getUserPublicFlags = require('./infouser-flags.js')

async function getUserData(interaction) {
    const user = interaction.options.getUser('target');
    const member = await interaction.guild.members.fetch(user.id).catch(() => null);
    const avatarURL = member?.displayAvatarURL({ size: 2048 }) || user.displayAvatarURL({ size: 2048 });

    const joinedAt = member ? member.joinedAt : null;
    const createdAt = user.createdAt ? user.createdAt.toLocaleDateString('ja-JP') : '不明';
    const joinedAtFormatted = joinedAt ? joinedAt.toLocaleDateString('ja-JP') : '未参加';

    const displayName = member?.displayName || user.username;
    const roleCount = member ? member.roles.cache.size - 1 : 'ロールなし';
    const nameColor = member?.roles?.highest?.color ? `#${member.roles.highest.color.toString(16)}` : '#ffffff';
    /*
    const statusMap = {
        [PresenceUpdateStatus.Online]: '<:online:1282208120113987634> オンライン',
        [PresenceUpdateStatus.DoNotDisturb]: '<:dnd:1282208118486601778> 取り込み中',
        [PresenceUpdateStatus.Idle]: '<:idle:1282208116783710259> 退席中',
        [PresenceUpdateStatus.Offline]: '<:offline:1282208115214782476> オフライン',
        [PresenceUpdateStatus.Invisible]: '<:offline:1282208115214782476> オフライン',
    };

    const status = statusMap[member?.presence?.status] || '<:offline:1282208115214782476> オフライン';

*/
    const bannerURL = await interaction.client.users.fetch(user.id, { force: true })
        .then(user => user.bannerURL({ size: 1024 }));

    const publicFlagsArray = await getUserPublicFlags(user.id);
    let userBadges = publicFlagsArray.map(flag => badges[flag] || '').join(' '); 

    const isBoosting = member?.premiumSince ? 'Yes' : 'No';
    if (isBoosting === 'Yes') {
        userBadges += ` ${badges['BOOSTER']}`; 
    }

    return {
        user,
        member,
        avatarURL,
        joinedAt,
        createdAt,
        joinedAtFormatted,
        displayName,
        roleCount,
        nameColor,
        isBoosting,
        // status,
        bannerURL,
        userBadges 
    };
}

module.exports = { getUserData };