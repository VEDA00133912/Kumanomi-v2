const mongoose = require('mongoose');

const expandSchema = new mongoose.Schema({
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

const omikujiSchema = new mongoose.Schema({
    userId: { 
        type: String, 
        required: true, 
        unique: true 
    },
    result: { 
        type: String, 
        required: true 
    },
    date: { 
        type: Date, 
        default: Date.now 
    },
});

const Expand = mongoose.model('Expand', expandSchema);
const Omikuji = mongoose.model('Omikuji', omikujiSchema);

module.exports = { Expand, Omikuji };