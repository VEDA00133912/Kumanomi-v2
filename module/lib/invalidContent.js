const { MessageFlags } = require('discord.js');

const invalidContentChecks = [
    { regex: /@everyone|@here/, error: '<:error:1299263288797827185> everyoneやhereを含めることはできません。' },
    { regex: /<@&\d+>|<@!\d+>|<@?\d+>/, error: '<:error:1299263288797827185> メンションを含めることはできません。' },
    { regex: /(?:https?:\/\/)?(?:discord\.(?:gg|com|me|app)(?:\/|\\)invite(?:\/|\\)?|discord\.(?:gg|me)(?:\/|\\)?)[a-zA-Z0-9]+/, error: '<:error:1299263288797827185> 招待リンクを含むメッセージは送信できません。' },
    { regex: /https?:\/\/[^\s]+/, error: '<:error:1299263288797827185> リンクを送信することはできません。' },
    { regex: /[\w-]{24}\.[\w-]{6}\.[\w-]{27}/, error: '<:error:1299263288797827185> トークンを含めることはできません。' },
    { regex: /\|{4,}/, error: '<:error:1299263288797827185> 連続するスポイラーを含めることはできません。' },
    { regex: /(discord\.com|discord\.gg|invite|https|http)/i, error: '<:error:1299263288797827185> リンクを送信することはできません。' }
];

const validateMessageContent = async (interaction, message) => {
    for (const { regex, error } of invalidContentChecks) {
        if (regex.test(message)) {
            await interaction.reply({ content: error, flags: MessageFlags.Ephemeral });
            return true;
        }
    }
    return false;
};

module.exports = { validateMessageContent };