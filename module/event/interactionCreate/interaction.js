const { Events, EmbedBuilder, PermissionsBitField, Colors, MessageFlags } = require('discord.js');
const interactionError = require('../../../error/interaction');

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction, client) {
        if (interaction.isCommand()) {
            try {
                if (interaction.guild) {
                    const permissionErrorEmbed = await checkPermissions(interaction);
                    if (permissionErrorEmbed) {
                        return interaction.reply({ embeds: [permissionErrorEmbed], flags: MessageFlags.Ephemeral });
                    }
                }

                const command = client.commands.get(interaction.commandName);
                if (!command) return;
                await command.execute(interaction, client);
            } catch (error) {
                interactionError(client, interaction, error);
                interaction.channel?.reply('<:error:1302169165905526805> コマンド実行中にエラーが発生しました');
            }
        } else if (interaction.isContextMenuCommand()) {
            try {
                if (interaction.guild) {
                    const permissionErrorEmbed = await checkPermissions(interaction);
                    if (permissionErrorEmbed) {
                        return interaction.reply({ embeds: [permissionErrorEmbed], flags: MessageFlags.Ephemeral });
                    }
                }

                const command = client.commands.get(interaction.commandName);
                if (!command) return;
                await command.execute(interaction, client);
            } catch (error) {
                interactionError(client, interaction, error);
                interaction.channel?.reply('<:error:1302169165905526805> コマンド実行中にエラーが発生しました');
            }
        }
    },
};

async function checkPermissions(interaction) {
    const missingServerPermissions = [];
    const missingChannelPermissions = [];

    // サーバー権限のチェック
    const botMember = interaction.guild.members.me;
    if (!botMember.permissions.has(PermissionsBitField.Flags.SendMessages)) {
        missingServerPermissions.push('・メッセージの送信');
    }
    if (!botMember.permissions.has(PermissionsBitField.Flags.ViewChannel)) {
        missingServerPermissions.push('・チャンネルを見る');
    }

    // チャンネル権限のチェック
    const channelPermissions = interaction.channel.permissionsFor(botMember);
    if (!channelPermissions.has(PermissionsBitField.Flags.SendMessages)) {
        missingChannelPermissions.push('・メッセージの送信');
    }
    if (!channelPermissions.has(PermissionsBitField.Flags.ViewChannel)) {
        missingChannelPermissions.push('・チャンネルを見る');
    }

    // エラーメッセージの作成
    if (missingServerPermissions.length > 0 || missingChannelPermissions.length > 0) {
        const errorEmbed = new EmbedBuilder()
            .setColor(Colors.Red)
            .setDescription('<:error:1302169165905526805> BOTに権限が不足しています')
            .setFooter({ text: 'Kumanomi | PermError', iconURL: interaction.client.user.displayAvatarURL() })
            .setTimestamp();

        if (missingServerPermissions.length > 0) {
            errorEmbed.addFields({
                name: 'サーバー権限',
                value: `\`\`\`${missingServerPermissions.join('\n')}\`\`\``,
            });
        }

        if (missingChannelPermissions.length > 0) {
            errorEmbed.addFields({
                name: 'チャンネル権限',
                value: `\`\`\`${missingChannelPermissions.join('\n')}\`\`\``,
            });
        }

        return errorEmbed;
    }

    return null;
}