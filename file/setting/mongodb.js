const mongoose = require('mongoose');

const expandSchema = new mongoose.Schema({
  guildId: {
    type: String,
    required: true,
    unique: true,
  },
  expand: {
    type: Boolean,
    default: true,
  },
});

const blacklistSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true,
  },
  guildId: {
    type: String,
    required: true,
  },
  addedAt: {
    type: Date,
    default: Date.now,
  },
});

const omikujiSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true,
  },
  result: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const timerSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true,
  },
  channelId: {
    type: String,
    required: true,
  },
  timeLeft: {
    type: Number,
    required: true,
  },
  startTime: {
    type: Number,
    required: true,
  },
});

const Expand = mongoose.model('Expand', expandSchema);
const Blacklist = mongoose.model('Blacklist', blacklistSchema);
const Omikuji = mongoose.model('Omikuji', omikujiSchema);
const Timer = mongoose.model('Timer', timerSchema);

module.exports = { Expand, Blacklist, Omikuji, Timer };