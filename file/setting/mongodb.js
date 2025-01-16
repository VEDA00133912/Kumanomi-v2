const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
    guildId: {
        type: String,
        required: true,
        unique: true,
    },
    expand: {
        type: Boolean,
        default: false,
    },
});

module.exports = mongoose.model('Settings', settingsSchema);