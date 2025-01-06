const { EmbedBuilder, MessageFlags } = require('discord.js');
const { permissions: permissionNames } = require('../../file/setting/permission');

const commandsRequiringUserPerms = [
    'create role', 
    'create channel', 
    'create emoji'
];

async function checkPermissions(interaction, requiredPermissions) {
    const mainCommandName = interaction.commandName;
    let subCommandName;
    try {
        subCommandName = interaction.options.getSubcommand() || null;
    } catch {
        subCommandName = null;
    }

    const fullCommandName = subCommandName 
        ? `${mainCommandName} ${subCommandName}` 
        : mainCommandName;

    const isUserPermsCheckRequired = commandsRequiringUserPerms.includes(fullCommandName);

    if (!interaction.member || !interaction.guild?.members?.me) {
        console.error('User or bot member information is missing.');
        await interaction.reply({
            content: '<:error:1302169165905526805> ユーザーまたはBOTの情報を取得できませんでした。',
            flags: MessageFlags.Ephemeral
        });
        return true;
    }

    const userMember = interaction.member;
    const botMember = interaction.guild.members.me;

    const missingMemberPerms = isUserPermsCheckRequired
        ? requiredPermissions.filter(perm => !userMember.permissions.has(perm))
        : [];
    const missingBotPerms = requiredPermissions.filter(perm => !botMember.permissions.has(perm));

    if (missingMemberPerms.length || missingBotPerms.length) {
        const missingPermsText = (missingMemberPerms.length
            ? `- あなたに必要な権限\n\`\`\`\n${missingMemberPerms.map(perm => permissionNames[perm] || perm).join('\n')}\n\`\`\``
            : '') + 
            (missingBotPerms.length
                ? `- BOTに必要な権限\n\`\`\`\n${missingBotPerms.map(perm => permissionNames[perm] || perm).join('\n')}\n\`\`\``
                : '');

        const missingPermsEmbed = new EmbedBuilder()
            .setColor('Red')
            .setTitle('<:error:1302169165905526805> 権限エラー')
            .setDescription(`権限が不足しているため、この操作を実行できません。\n${missingPermsText}`)
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