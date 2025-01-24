const { SlashCommandBuilder, PermissionFlagsBits, InteractionContextType, Colors, MessageFlags, ApplicationIntegrationType } = require('discord.js');
const cooldown = require('../../../event/other/cooldown');
const moderateUsers = require('../../../lib/moderate');
const slashcommandError = require('../../../../error/slashcommand');
const { checkPermissions } = require('../../../lib/permission');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unban')
        .setDescription('指定したユーザーのBAN解除をします')
        .setContexts(InteractionContextType.Guild)
        .setIntegrationTypes(ApplicationIntegrationType.GuildInstall)
        .addUserOption(option =>
            option.setName('user1').setDescription('解除するユーザー1').setRequired(true))
        .addUserOption(option => option.setName('user2').setDescription('解除するユーザー2'))
        .addUserOption(option => option.setName('user3').setDescription('解除するユーザー3'))
        .addStringOption(option =>
            option.setName('reason').setDescription('理由（50文字以内）').setMinLength(1).setMaxLength(50))
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),

    async execute(interaction) {
        if (cooldown(this.data.name, interaction)) return;

        if (await checkPermissions(interaction, [ PermissionFlagsBits.BanMembers ])) return;
        
        const reason = interaction.options.getString('reason') || '理由なし';
        const users = ['user1', 'user2', 'user3']
            .map(optionName => interaction.options.getUser(optionName))
            .filter(Boolean);

        try {
            await interaction.deferReply({ flags: MessageFlags.Ephemeral });
            const embed = await moderateUsers(interaction, users, 'unban', reason, Colors.Green, 'unBAN');
            await interaction.editReply({ embeds: [embed] });
        } catch (error) {
            slashcommandError(interaction.client, interaction, error);
        }
    },
};