const { SlashCommandBuilder, PermissionFlagsBits, MessageFlags, Colors, InteractionContextType, ApplicationIntegrationType } = require('discord.js');
const moderateUsers = require('../../../lib/moderate');
const cooldown = require('../../../event/other/cooldown');
const slashcommandError = require('../../../../error/slashcommand');
const { checkPermissions } = require('../../../lib/permission');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ban')
        .setDescription('指定したユーザーをBANします')
        .setContexts(InteractionContextType.Guild)
        .setIntegrationTypes(ApplicationIntegrationType.GuildInstall)
        .addUserOption(option =>
            option.setName('user1').setDescription('BANするユーザー1').setRequired(true))
        .addUserOption(option => option.setName('user2').setDescription('BANするユーザー2'))
        .addUserOption(option => option.setName('user3').setDescription('BANするユーザー3'))
        .addStringOption(option =>
            option.setName('reason').setDescription('理由（50文字以内）').setMinLength(1).setMaxLength(50))
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),

    async execute(interaction) {
        if (cooldown(this.data.name, interaction)) return;
        if (await checkPermissions(interaction, [PermissionFlagsBits.BanMembers])) return;

        const reason = interaction.options.getString('reason') || '理由なし';
        const users = ['user1', 'user2', 'user3']
            .map(optionName => interaction.options.getUser(optionName))
            .filter(Boolean);

        try {
            await interaction.deferReply({ flags: MessageFlags.Ephemeral });
            const embed = await moderateUsers(interaction, users, 'ban', reason, Colors.Red, 'BAN');
            await interaction.editReply({ embeds: [embed] });
        } catch (error) {
            slashcommandError(interaction.client, interaction, error);
        }
    },
};