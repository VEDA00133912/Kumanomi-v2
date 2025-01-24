const { SlashCommandBuilder, InteractionContextType, ApplicationIntegrationType } = require('discord.js');
const { getRandomFortune, specialFortune } = require('../../lib/omikuji');
const { createEmbed } = require('../../lib/embed');
const cooldown = require('../../event/other/cooldown');
const slashcommandError = require('../../../error/slashcommand');
const path = require('path');
const specialThumbnailPath = path.join(__dirname, '../../data/assets/special.png');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('omikuji')
        .setDescription('おみくじを引けます')
        .setContexts(InteractionContextType.Guild)
        .setIntegrationTypes(ApplicationIntegrationType.GuildInstall),

    async execute(interaction) {
        if (cooldown(this.data.name, interaction)) return;
        const userId = interaction.user.id;

        try {
            const loadingEmbed = createEmbed(interaction)
                .setDescription('<a:omikuji:1302169074083823646> おみくじを引いています...');
            await interaction.reply({ embeds: [loadingEmbed] });

            const { result, alreadyDrawn } = await getRandomFortune(userId);

            if (alreadyDrawn) {
                const embed = createEmbed(interaction)
                    .setDescription(`今日のおみくじはもう引きました！\nまた明日引いてください！`);
                return interaction.editReply({ embeds: [embed] });
            }

            const embed = createEmbed(interaction)
                .setTitle('<a:omikuji:1302169074083823646> おみくじ結果')
                .setDescription(`今日の<@${userId}>は **${result}** だよ！\nまた明日引いてね！`);

            if (result === specialFortune) {
                embed.setThumbnail(specialThumbnailPath);
            }

            return interaction.editReply({ embeds: [embed] });
        } catch (error) {
            slashcommandError(interaction.client, interaction, error);
        }
    },
};