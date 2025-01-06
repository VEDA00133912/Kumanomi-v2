const { Client, GatewayIntentBits, Collection } = require('discord.js');
const { loadCommands, loadAdminCommands, loadEvents } = require('./module/event/other/loader');
const setupGlobalErrorHandling = require('./error/global');
const path = require('path');
require('dotenv').config();

const client = new Client(
    { 
        intents: [
        GatewayIntentBits.Guilds, 
        GatewayIntentBits.GuildMessages, 
        GatewayIntentBits.MessageContent, 
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildPresences
     ]
    }
);

client.commands = new Collection();
client.contextMenuCommands = new Collection();

loadCommands(client, path.join(__dirname, 'module/function/slashcommand'));
loadCommands(client, path.join(__dirname, 'module/function/contextmenu'));
loadAdminCommands(client, path.join(__dirname, 'module/function/admin'));
loadEvents(client, path.join(__dirname, 'module/event'));

setupGlobalErrorHandling(client);
client.login(process.env.DISCORD_TOKEN);