const { SlashCommandBuilder, MessageFlags, InteractionContextType, ApplicationIntegrationType } = require('discord.js');
const cooldown = require('../../event/other/cooldown');
const slashCommandError = require('../../../error/slashcommand');
const { createEmbed } = require('../../lib/embed');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('dice')
        .setDescription('多面ダイスを振ります')
        .setContexts(InteractionContextType.Guild)
        .setIntegrationTypes(ApplicationIntegrationType.GuildInstall)
        .addIntegerOption(option =>
            option.setName('count')
                .setDescription('振る個数を指定してください')
                .setMinValue(1)
                .setMaxValue(100))
        .addIntegerOption(option =>
            option.setName('max')
                .setDescription('サイコロの最大値を指定してください')
                .setMinValue(1)
                .setMaxValue(500)),

    async execute(interaction) {
        try {
            if (cooldown(this.data.name, interaction)) return;

            await interaction.deferReply({ flags: MessageFlags.Ephemeral });

            const count = interaction.options.getInteger('count') || 1;
            const max = interaction.options.getInteger('max') || 100;

            const results = Array.from({ length: count }, () => Math.floor(Math.random() * max) + 1);
            const embed = createEmbed(interaction)
            .setTitle(`🎲 ${count}d${max} Results`)
            .setDescription(`**${results.join(', ')}**`);

            await interaction.editReply({ embeds: [embed] });
        } catch (error) {
            slashCommandError(interaction.client, interaction, error);
        }
    },
};