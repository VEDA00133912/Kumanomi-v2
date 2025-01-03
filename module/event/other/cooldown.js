const { MessageFlags } = require('discord.js'); 
const cooldowns = new Map();

module.exports = (commandName, interaction, cooldownTime = 5000) => { 
    const userId = interaction.user.id;
    const now = Date.now();

    if (!cooldowns.has(commandName)) cooldowns.set(commandName, new Map());
    const timestamps = cooldowns.get(commandName);

    if (timestamps.has(userId)) {
        const expirationTime = timestamps.get(userId) + cooldownTime;
        if (now < expirationTime) {
            return interaction.reply({ 
                content: `<:error:1302169165905526805> クールダウン中です。あと ${((expirationTime - now) / 1000).toFixed(1)} 秒後に実行できます。`, 
                flags: MessageFlags.Ephemeral
            });
        }
    }

    timestamps.set(userId, now);
    setTimeout(() => timestamps.delete(userId), cooldownTime);
};