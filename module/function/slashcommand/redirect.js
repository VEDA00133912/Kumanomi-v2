const { SlashCommandBuilder, EmbedBuilder, InteractionContextType, MessageFlags } = require('discord.js');
const { checkRedirect } = require('../../lib/redirect');
const cooldown = require('../../event/other/cooldown');
const slashcommandError = require('../../../error/slashcommand');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('redirect')
        .setDescription('指定されたURLのリダイレクト情報を表示します')
        .setContexts(InteractionContextType.Guild)
        .setIntegrationTypes(0)
        .addStringOption(option =>
            option.setName('url')
                .setDescription('リダイレクトをチェックするURL')
                .setRequired(true)),
    
    async execute(interaction) {
        if (cooldown(this.data.name, interaction)) return;

        try {
            await interaction.deferReply({ flags: MessageFlags.Ephemeral });

            const url = interaction.options.getString('url');
            const redirectResult = await checkRedirect(url);

            const embed = new EmbedBuilder()
                .setColor('Green')
                .setTimestamp()
                .setFooter({ text: 'Kumanomi | redirect', iconURL: interaction.client.user.displayAvatarURL() })
                .addFields(
                    redirectResult.map((item, index) => ({
                        name: `リダイレクト先 ${index + 1}`,
                        value: item.url || 'アクセスできません',
                        inline: false,
                    }))
                );

            await interaction.editReply({ embeds: [embed] });
        } catch (error) {
            slashcommandError(interaction.client, interaction, error);
        }
    },
};