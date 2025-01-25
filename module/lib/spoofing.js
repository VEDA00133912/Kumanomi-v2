const { WebhookClient } = require('discord.js');
const { Webhook } = require('../../file/setting/mongodb');
const axios = require('axios');

async function getWebhookClient(channel, targetUser) {
  let webhookURL;

  try {
    const webhookData = await Webhook.findOne({ channelId: channel.id });

    if (webhookData) {
      webhookURL = webhookData.webhookUrl;

      const [webhookId, webhookToken] = webhookURL.split('/').slice(-2);

      try {
        const res = await axios.get(`https://discord.com/api/webhooks/${webhookId}/${webhookToken}`);
        
        if (res.status === 200) {
          return new WebhookClient({ url: webhookURL });
        } else {
          await Webhook.deleteOne({ channelId: channel.id });

          let avatarURL;
          try {
            avatarURL = await getAvatarURL(channel, targetUser);
          } catch (err) {
            console.error('Error fetching user avatar:', err);
            throw err;
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

          return new WebhookClient({ url: webhookURL });
        }
      } catch (error) {
        if (error.response && error.response.status === 404) {
          console.warn('Webhook not found, creating a new one...');
          await Webhook.deleteOne({ channelId: channel.id });
        } else {
          console.error('Error validating webhook:', error);
          throw error;
        }
      }
    } else {
      console.log('No webhook data found in database for this channel.');
    }

    let avatarURL;
    try {
      avatarURL = await getAvatarURL(channel, targetUser);
    } catch (err) {
      console.error('Error fetching user avatar:', err);
      throw err;
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

    return new WebhookClient({ url: webhookURL });
  } catch (err) {
    console.error('Error retrieving or creating webhook:', err);
    throw err;
  }
}

async function getAvatarURL(channel, targetUser) {
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
  return avatarURL;
}

module.exports = { getWebhookClient };
