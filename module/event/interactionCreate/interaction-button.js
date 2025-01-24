const { Events, MessageFlags, ButtonBuilder, ActionRowBuilder, ButtonStyle, EmbedBuilder, AttachmentBuilder } = require('discord.js');
const ticketHandler = require('../../lib/ticket');
const { MiQ } = require('makeitaquote');

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {
        if (!interaction.isButton()) return;

        try {
            if (interaction.customId === 'create') {
                await ticketHandler.createTicket(interaction);
                return;
            } else if (interaction.customId === 'del') {
                await ticketHandler.deleteTicket(interaction);
                return;
            }

            if (interaction.customId.startsWith('miq-')) {
                const [_, messageId, authorId, embedMessageId, colorMode] = interaction.customId.split('-');
                const targetChannel = interaction.channel;

                const targetMessage = await targetChannel.messages.fetch(messageId).catch(() => null);
                if (!targetMessage) {
                    await interaction.reply({
                        content: '元のメッセージが見つかりませんでした',
                        flags: MessageFlags.Ephemeral,
                    });
                    return;
                }

                const embedMessage = await targetChannel.messages.fetch(embedMessageId).catch(() => null);
                if (!embedMessage) {
                    await interaction.reply({
                        content: 'メッセージが見つかりませんでした',
                        flags: MessageFlags.Ephemeral,
                    });
                    return;
                }

                await interaction.deferUpdate();

                const miq = new MiQ()
                    .setFromMessage(targetMessage)
                    .setWatermark(interaction.client.user.tag)
                    .setColor(colorMode === 'false');

                const response = await miq.generateBeta();
                const attachment = new AttachmentBuilder(response, { name: 'miq.png' });

                const updatedEmbed = EmbedBuilder.from(embedMessage.embeds[0])
                    .setImage('attachment://miq.png');

                const newColorMode = colorMode === 'false' ? 'true' : 'false';
                const colorButton = new ButtonBuilder()
                    .setCustomId(`miq-${messageId}-${authorId}-${embedMessageId}-${newColorMode}`)
                    .setEmoji('<a:hiroyuki:1331895832454238258>')
                    .setStyle(ButtonStyle.Primary);

                const row = new ActionRowBuilder().addComponents(colorButton);

                await embedMessage.edit({
                    embeds: [updatedEmbed],
                    files: [attachment],
                    components: [row],
                });
            }
        } catch (error) {
            console.error(error); 
            await interaction.followUp({
                content: 'エラーが発生しました',
                flags: MessageFlags.Ephemeral,
            });
        }
    },
};