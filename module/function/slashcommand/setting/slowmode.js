const { SlashCommandBuilder, PermissionFlagsBits, InteractionContextType, MessageFlags, Colors, ApplicationIntegrationType } = require('discord.js');
const cooldown = require('../../../event/other/cooldown');
const slashcommandError = require('../../../../error/slashcommand');
const { checkPermissions } = require('../../../lib/permission');
const { createEmbed } = require('../../../lib/embed');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setting-slowmode')
        .setDescription('低速モードの設定をします')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
        .setContexts(InteractionContextType.Guild)
        .setIntegrationTypes(ApplicationIntegrationType.GuildInstall)
        .addIntegerOption(option =>
            option.setName('time')
                .setDescription('低速の時間を選択してください')
                .addChoices(
                    { name: '解除 (0秒)', value: 0 },
                    { name: '5秒', value: 5 },
                    { name: '10秒', value: 10 },
                    { name: '15秒', value: 15 },
                    { name: '30秒', value: 30 },
                    { name: '1分', value: 60 },
                    { name: '2分', value: 120 },
                    { name: '5分', value: 300 },
                    { name: '10分', value: 600 },
                    { name: '15分', value: 900 },
                    { name: '1時間', value: 3600 },
                    { name: '2時間', value: 7200 },
                    { name: '6時間', value: 21600 }
                )
                .setRequired(true)),
    async execute(interaction) {
        if (cooldown(this.data.name, interaction)) return;

        if (await checkPermissions(interaction, [PermissionFlagsBits.ManageChannels])) return;

        const duration = interaction.options.getInteger('time');
        const currentRateLimit = interaction.channel.rateLimitPerUser;

        if (currentRateLimit === duration) {
            return interaction.reply({
                embeds: [createEmbed(interaction).setColor(Colors.Yellow).setDescription(
                    duration === 0
                        ? '<:warn:1302169126873206794> このチャンネルでは低速モードは設定されていません'
                        : `<:warn:1302169126873206794> このチャンネルはすでに${duration}秒の低速モードが設定されています`
                )],
                flags: MessageFlags.Ephemeral
            });
        }

        try {
            await interaction.deferReply({ flags: MessageFlags.Ephemeral });
            await interaction.channel.setRateLimitPerUser(duration);

            const embedDescription = duration === 0 
                ? '低速モードを解除しました' 
                : `低速モードを\`${duration}\`秒で設定しました`;

            await interaction.editReply({
                embeds: [createEmbed(interaction).setDescription(embedDescription)]
            });
        } catch (error) {
            slashcommandError(interaction.client, interaction, error);
        }
    },
};