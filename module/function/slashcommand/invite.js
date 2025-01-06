const { SlashCommandBuilder, MessageFlags } = require('discord.js');
const cooldown = require('../../event/other/cooldown');
const errorHandler = require('../../../error/slashcommand');
const { createEmbed } = require('../../lib/embed');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('invite')
        .setDescription('BOTの招待リンクを表示します')
        .setIntegrationTypes(0, 1),

    async execute(interaction) {
        if (cooldown(this.data.name, interaction)) return;

        try {
            const embed = createEmbed(interaction).setDescription(
                '**ここから導入できます**\n\n' +
                '**[招待する！](https://discord.com/oauth2/authorize?client_id=1298829009907355730)**\n\n' +
                '**[サポートサーバー](https://discord.gg/Ftz4Tcs8tR)**'
            );

            await interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral });
        } catch (error) {
            errorHandler(interaction.client, interaction, error);
        }
    },
};