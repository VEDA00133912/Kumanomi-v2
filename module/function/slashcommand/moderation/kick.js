const { SlashCommandBuilder, PermissionFlagsBits, MessageFlags, Colors } = require('discord.js');
const moderateUsers = require('../../../lib/moderate');
const cooldown = require('../../../event/other/cooldown');
const slashcommandError = require('../../../../error/slashcommand');
const { checkPermissions } = require('../../../lib/permission');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('kick')
        .setDescription('指定したユーザーをキックします')
        .addUserOption(option =>
            option.setName('user1').setDescription('キックするユーザー1').setRequired(true))
        .addUserOption(option => option.setName('user2').setDescription('キックするユーザー2'))
        .addUserOption(option => option.setName('user3').setDescription('キックするユーザー3'))
        .addStringOption(option =>
            option.setName('reason').setDescription('理由（50文字以内）').setMinLength(1).setMaxLength(50))
        .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),

    async execute(interaction) {
        if (cooldown(this.data.name, interaction)) return;
        if (await checkPermissions(interaction, [PermissionFlagsBits.KickMembers])) return;

        const reason = interaction.options.getString('reason') || '理由なし';
        const users = ['user1', 'user2', 'user3']
            .map(option => interaction.options.getUser(option))
            .filter(Boolean);

        try {
            await interaction.deferReply({ flags: MessageFlags.Ephemeral });
            const embed = await moderateUsers(interaction, users, 'kick', reason, Colors.Orange, 'キック');
            await interaction.editReply({ embeds: [embed] });
        } catch (error) {
            slashcommandError(interaction.client, interaction, error);
        }
    },
};