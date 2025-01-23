const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const axios = require('axios');
const cheerio = require('cheerio');
const cooldown = require('../../event/other/cooldown');
const slashcommandError = require('../../../error/slashcommand'); 
const { checkPermissions } = require('../../lib/permission');
const config = require('../../../file/setting/url.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('yahoonews')
        .setDescription('Yahooニュースリンクを送信します'),

    async execute(interaction) {
        if (cooldown(this.data.name, interaction)) return;

        if (await checkPermissions(interaction, [PermissionFlagsBits.EmbedLinks])) return;

        await interaction.deferReply();

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