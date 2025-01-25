const { SlashCommandBuilder, InteractionContextType, PermissionFlagsBits, EmbedBuilder, MessageFlags, Colors, ApplicationIntegrationType } = require('discord.js');
const cooldown = require('../../../event/other/cooldown');
const slashcommandError = require('../../../../error/slashcommand');
const Settings = require('../../../../file/setting/mongodb'); 

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setting-expand')
        .setDescription('メッセージリンクの展開のオンオフ設定をします')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .setContexts(InteractionContextType.Guild)
        .setIntegrationTypes(ApplicationIntegrationType.GuildInstall)
        .addStringOption(option =>
            option.setName('on-off')
                .setDescription('オンかオフを選択')
                .setRequired(true)
                .addChoices(
                    { name: '展開機能ON', value: 'true' },
                    { name: '展開機能OFF', value: 'false' },
                )),
    
    async execute(interaction) {
        if (cooldown(this.data.name, interaction)) return;

        const status = interaction.options.getString('on-off') === 'true';
        
        try {
            await interaction.deferReply({ flags: MessageFlags.Ephemeral });

            let settings = await Settings.findOne({ guildId: interaction.guild.id });

            if (!settings) {
                settings = new Settings({
                    guildId: interaction.guild.id,
                    expand: status,
                });
            } else if (settings.expand === status) {
                const embed = new EmbedBuilder()
                    .setTitle('設定変更')
                    .setDescription(`<:error:1302169165905526805> すでに${status ? 'ON' : 'OFF'}になっています。`)
                    .setColor(status ? Colors.Green : Colors.Red)  
                    .setFooter({ text: 'Kumanomi | expand', iconURL: interaction.client.user.displayAvatarURL() })
                    .setTimestamp();

                return interaction.editReply({ embeds: [embed] });
            }

            settings.expand = status;
            await settings.save();

            const embed = new EmbedBuilder()
                .setDescription(`<:check:1302169183110565958> **メッセージリンクの展開は ${status ? 'ON' : 'OFF'} になりました。**`)
                .setColor(status ? Colors.Green : Colors.Red)  
                .setFooter({ text: 'Kumanomi | expand', iconURL: interaction.client.user.displayAvatarURL() })
                .setTimestamp();

            await interaction.editReply({ embeds: [embed] });
        } catch (error) {
            slashcommandError(interaction.client, interaction, error);
        }
    },
};