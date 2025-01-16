const { SlashCommandBuilder, MessageFlags } = require('discord.js');
const cooldown = require('../../event/other/cooldown');
const slashcommandError = require('../../../error/slashcommand');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('song')
        .setDescription('癖になる')
        .addSubcommand(subcommand => subcommand
            .setName('kongyo')
            .setDescription('『コンギョ』のリンク')
        )
        .addSubcommand(subcommand => subcommand
            .setName('sonshi')
            .setDescription('『尊師マーチ』のリンク')
        ),

    async execute(interaction) {
        const subcommand = interaction.options.getSubcommand();
        const commandName = `song ${subcommand}`;
        if (cooldown(commandName, interaction)) return;

        try {
            const urls = {
                kongyo: 'https://youtu.be/IkOEbH7lawI',
                sonshi: 'https://youtu.be/W1iwjWmOkuI',
            };
            await interaction.reply({ content: subcommand === 'kongyo' ? `:flag_kp: ${urls.kongyo}` : `:woman_tone1_beard: ${urls.sonshi}`, flags: MessageFlags.Ephemeral });
        } catch (error) {
            slashcommandError(interaction.client, interaction, error);
        }
    },
};