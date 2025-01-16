const { EmbedBuilder } = require('discord.js');

async function moderateUsers(interaction, users, action, reason, successColor, actionVerb) {
    const results = { success: [], skipped: [], failed: [] };
    const bannedUsers = ['ban', 'unban'].includes(action) ? await interaction.guild.bans.fetch() : null;

    for (const user of users) {
        const member = await interaction.guild.members.fetch(user.id).catch(() => null);
        try {
            if (action === 'ban') {
                if (bannedUsers.has(user.id)) {
                    results.skipped.push(`${user.tag}\nBAN済です`);
                } else {
                    await interaction.guild.members.ban(user, { reason });
                    results.success.push(`${user.tag}\nID: ${user.id}`);
                }
            } else if (action === 'kick' && member?.kickable) {
                await member.kick(reason);
                results.success.push(`${user.tag}\nID: ${user.id}`);
            } else if (action === 'unban' && bannedUsers.has(user.id)) {
                await interaction.guild.members.unban(user.id, reason);
                results.success.push(`${user.tag}\nID: ${user.id}`);
            } else {
                results.skipped.push(
                    `${user.tag} (${action === 'unban' ? '未BAN' : action === 'kick' ? '退出済み' : 'BANできません'})`
                );
            }
        } catch (error) {
            results.failed.push(`${user.tag} (エラー: ${error.message})`);
        }
    }

    const embed = new EmbedBuilder()
        .setColor(successColor)
        .setTitle(`${actionVerb}結果`)
        .addFields(
            { name: '理由', value: reason },
            { name: `${actionVerb}成功`, value: results.success.join('\n') || 'なし' },
            { name: `${actionVerb}失敗`, value: results.failed.join('\n') || 'なし' },
            { name: '不要', value: results.skipped.join('\n') || 'なし' }
        )
        .setFooter({ text: `Kumanomi | ${actionVerb}`, iconURL: interaction.client.user.displayAvatarURL() })
        .setTimestamp();

    return embed;
}

module.exports = moderateUsers;