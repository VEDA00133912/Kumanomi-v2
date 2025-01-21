const { SlashCommandBuilder, InteractionContextType, MessageFlags } = require('discord.js');
const cooldown = require('../../event/other/cooldown');
const slashCommandError = require('../../../error/slashcommand'); 
const { createEmbed } = require('../../lib/embed');
const { generateUUID } = require('../../lib/uuid');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('uuid')
        .setDescription('UUIDを生成します')
        .setContexts(InteractionContextType.Guild)
        .setIntegrationTypes(0)
        .addIntegerOption(option =>
            option.setName('count')
                .setDescription('生成するUUIDの数')
                .setMinValue(1)
                .setMaxValue(10)
        ),

    async execute(interaction) {
        if (cooldown(this.data.name, interaction)) return;

        const count = interaction.options.getInteger('count');
        
        try {
            await interaction.deferReply({ flags: MessageFlags.Ephemeral });
            const uuids = Array.from({ length: count }, () => generateUUID());

            const embed = createEmbed(interaction)
                .setDescription(uuids.map(uuid => `\`\`\`${uuid}\`\`\``).join('\n'));

            await interaction.editReply({ embeds: [embed] });

        } catch (error) {
            slashCommandError(interaction.client, interaction, error);
        }
    },
};