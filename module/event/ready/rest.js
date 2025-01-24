const { REST, Routes } = require('discord.js');
const fs = require('fs');
const path = require('path');
const configData = require('../../../file/setting/config.json');
require('dotenv').config();

const commands = [];

const loadCommands = (dir) => {
  const readDirRecursive = (directory) => {
    const files = fs.readdirSync(directory);
    files.forEach(file => {
      const fullPath = path.join(directory, file);
      if (fs.statSync(fullPath).isDirectory()) {
        readDirRecursive(fullPath);
      } else if (file.endsWith('.js')) {
        commands.push(require(fullPath).data.toJSON());
      }
    });
  };

  const commandDir = path.join(__dirname, '..', '..', 'function', dir);
  readDirRecursive(commandDir);
};

loadCommands('slashcommand');
loadCommands('contextmenu');
loadCommands('userinstall');

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