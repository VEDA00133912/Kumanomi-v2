const { SlashCommandBuilder, InteractionContextType, ApplicationIntegrationType, MessageFlags } = require('discord.js');
const axios = require('axios');
const cheerio = require('cheerio');
const cooldown = require('../../../event/other/cooldown');
const slashcommandError = require('../../../../error/slashcommand'); 
const config = require('../../../../file/setting/url.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('yahoonews')
        .setDescription('Yahooニュースリンクを送信します')
        .setContexts(InteractionContextType.Guild)
        .setIntegrationTypes(ApplicationIntegrationType.GuildInstall, ApplicationIntegrationType.UserInstall),

    async execute(interaction) {
        if (cooldown(this.data.name, interaction)) return;

        await interaction.deferReply({ flags: MessageFlags.Ephemeral });

        try {
            const response = await axios.get(config.yahooNewsURL);
            const $ = cheerio.load(response.data);
            const newsLinks = $('a[href*="news.yahoo.co.jp/pickup"]')
                .map((_, el) => $(el).attr('href'))
                .get();

            const replyContent = newsLinks.length
                ? newsLinks[Math.floor(Math.random() * newsLinks.length)]
                : 'ニュースが見つかりません';

            await interaction.editReply({ content: replyContent });
        } catch (error) {
            slashcommandError(interaction.client, interaction, error);
        }
    }
};