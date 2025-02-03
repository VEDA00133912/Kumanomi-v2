const { EmbedBuilder, MessageFlags } = require('discord.js');
const { permissions: permissionNames } = require('../../file/setting/permission');

async function checkPermissions(interaction, requiredPermissions) {
    if (!interaction.guild?.members?.me) {
        console.error('BOTの情報を取得できませんでした');
        await interaction.reply({
            content: '<:error:1302169165905526805> BOTの情報を取得できませんでした',
            flags: MessageFlags.Ephemeral
        });
        return true;
    }

    const botMember = interaction.guild.members.me;

    const missingBotPerms = requiredPermissions.filter(perm => !botMember.permissions.has(perm));

    if (missingBotPerms.length) {
        const missingPermsText = `- BOTに不足している権限\n\`\`\`\n${missingBotPerms.map(perm => permissionNames[perm] || perm).join('\n')}\n\`\`\``;

        const missingPermsEmbed = new EmbedBuilder()
            .setColor('Red')
            .setTitle('<:error:1302169165905526805> 権限エラー')
            .setDescription(`このコマンドを実行できません\n${missingPermsText}`)
            .setFooter({ text: 'Kumanomi | PermissionsError' })
            .setTimestamp();

        await interaction.reply({
            embeds: [missingPermsEmbed],
            flags: MessageFlags.Ephemeral
        });
        return true;
    }

    return false;
}

module.exports = { checkPermissions };