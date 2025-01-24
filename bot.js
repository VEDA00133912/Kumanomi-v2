const { Client, GatewayIntentBits, Collection } = require('discord.js');
const { loadCommands, loadAdminCommands, loadEvents } = require('./module/event/other/loader');
const setupGlobalErrorHandling = require('./error/global');
const path = require('path');
require('dotenv').config();
const TOKEN = process.env.DISCORD_TOKEN;

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
loadCommands(client, path.join(__dirname, 'module/function/userinstall'));
loadAdminCommands(client, path.join(__dirname, 'module/function/admin'));
loadEvents(client, path.join(__dirname, 'module/event'));

setupGlobalErrorHandling(client);
client.login(TOKEN);