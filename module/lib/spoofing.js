const { WebhookClient } = require('discord.js');
const { Webhook } = require('../../file/setting/mongodb');

async function getWebhookClient(channel, targetUser) {
  let webhookURL;
  
  try {
    const webhookData = await Webhook.findOne({ channelId: channel.id });

    if (webhookData) {
      webhookURL = webhookData.webhookUrl;
    } else {
      let avatarURL;

      try {
        const guildMember = await channel.guild.members.fetch(targetUser.id);
        avatarURL = guildMember.displayAvatarURL({ extension: 'png', size: 2048 });
      } catch (err) {
        if (err.code === 10007) {
          avatarURL = targetUser.displayAvatarURL({ extension: 'png', size: 2048 });
        } else {
          throw err; 
        }
      }

      const createdWebhook = await channel.createWebhook({
        name: targetUser.username,
        avatar: avatarURL,
        reason: 'Spoofingを実行しました',
      });

      webhookURL = `https://discord.com/api/webhooks/${createdWebhook.id}/${createdWebhook.token}`;

      const newWebhook = new Webhook({
        channelId: channel.id,
        webhookUrl: webhookURL,
      });
      await newWebhook.save();
    }

  } catch (err) {
    console.error('Error retrieving or creating webhook:', err);
    throw err;
  }

  const webhookClient = new WebhookClient({ url: webhookURL });
  return webhookClient;
}

module.exports = { getWebhookClient };