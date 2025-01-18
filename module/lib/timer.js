const { userMention } = require('discord.js');
const { createEmbed } = require('./embed');
const { Timer } = require('../../file/setting/mongodb'); 

async function saveTimer(userId, channelId, totalSeconds) {
  const existingTimer = await Timer.findOne({ userId });
  if (existingTimer) {
    existingTimer.channelId = channelId;
    existingTimer.timeLeft = totalSeconds;
    existingTimer.startTime = Date.now();
    await existingTimer.save();
  } else {
    const timer = new Timer({
      userId,
      channelId,
      timeLeft: totalSeconds,
      startTime: Date.now(),
    });
    await timer.save();
  }
}

async function removeTimer(userId) {
  await Timer.deleteOne({ userId });
}

async function loadTimers() {
  return await Timer.find(); 
}

async function resumeTimers(client) {
  const timers = await loadTimers(); 
  timers.forEach(async (timer) => {
    const elapsedTime = Math.floor((Date.now() - timer.startTime) / 1000);
    const remainingTime = timer.timeLeft - elapsedTime;

    if (remainingTime > 0) {
      setTimeout(async () => {
        const channel = await client.channels.fetch(timer.channelId);
        const embed = createTimerEmbed(Math.floor(timer.timeLeft / 60), timer.timeLeft % 60);
        channel.send({ content: userMention(timer.userId), embeds: [embed] });
        removeTimer(timer.userId); 
      }, remainingTime * 1000);
    } else {
      removeTimer(timer.userId);
    }
  });
}

function startTimer(interaction, minutes, seconds, totalSeconds) {
  setTimeout(async () => {
    const embed = createTimerEmbed(minutes, seconds, interaction);
    interaction.channel.send({ content: `${interaction.user}`, embeds: [embed] });
    removeTimer(interaction.user.id); 
  }, totalSeconds * 1000);
}

function createTimerEmbed(minutes, seconds, interaction) {
  return createEmbed(interaction)
    .setTitle('⏰️ 時間になりました')
    .setDescription(`${minutes}分${seconds}秒が経過しました！`);
}

function validateTime(minutes, seconds) {
  return minutes >= 0 && minutes <= 60 && seconds >= 0 && seconds < 60;
}

module.exports = {
  saveTimer,
  removeTimer,
  loadTimers,
  resumeTimers,
  startTimer,
  createTimerEmbed,
  validateTime,
};
