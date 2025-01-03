const { REST, Routes } = require('discord.js');
const fs = require('fs');
const path = require('path');
const configData = require('../../../file/setting/config.json'); 
require('dotenv').config();

const commands = [];

const loadCommands = (dir) => {
  const commandFiles = fs.readdirSync(path.join(__dirname, '..', '..', 'function', dir))
    .filter(file => file.endsWith('.js'))
    .map(file => require(path.join(__dirname, '..', '..', 'function', dir, file)).data.toJSON());
  
  commands.push(...commandFiles);
};

loadCommands('slashcommand');
loadCommands('contextmenu');

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

(async () => {
    try {
        console.log('Started refreshing application (/) commands.');

        await rest.put(
            Routes.applicationCommands(configData.clientId), 
            { body: commands }
        );

        console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error(error);
    }
})();