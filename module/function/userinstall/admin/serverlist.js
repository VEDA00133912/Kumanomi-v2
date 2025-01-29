const { SlashCommandBuilder, EmbedBuilder, Colors, MessageFlags, InteractionContextType, ApplicationIntegrationType } = require('discord.js');
const config = require('../../../../file/setting/config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('admin-serverlist')
        .setDescription('[管理者専用] サーバーの一覧')
        .setContexts(InteractionContextType.BotDM)
        .setIntegrationTypes(ApplicationIntegrationType.UserInstall),

    async execute(interaction) {
        if (interaction.user.id !== config.ownerId) {
            return interaction.reply({ content: '<:error:1302169165905526805> 管理者のみ実行できます', flags: MessageFlags.Ephemeral });
        }

        try {
            const guilds = interaction.client.guilds.cache.map(guild => guild.name);
            if (guilds.length === 0) return interaction.reply({ content: '<:error:1302169165905526805> ボットが参加しているサーバーはありません', flags: MessageFlags.Ephemeral });

            let description = '', count = 1, embeds = [];
            for (const guildName of guilds) {
                const entry = `**${count++}.** ${guildName}\n`;
                if (description.length + entry.length > 4096) {
                    embeds.push(new EmbedBuilder().setTitle('参加サーバー一覧').setDescription(description).setColor(Colors.Blue));
                    description = '';
                }
                description += entry;
            }
            if (description) {
                embeds.push(new EmbedBuilder().setTitle('参加サーバー一覧').setDescription(description).setColor(Colors.Blue));
            }

            await interaction.reply({ embeds: [embeds.shift()], flags: MessageFlags.Ephemeral });
            for (const embed of embeds) {
                await interaction.followUp({ embeds: [embed], flags: MessageFlags.Ephemeral });
            }
        } catch (error) {
            console.error(error);
            return interaction.reply({ content: '<:error:1302169165905526805> エラーが発生しました', flags: MessageFlags.Ephemeral });
        }
    }
};