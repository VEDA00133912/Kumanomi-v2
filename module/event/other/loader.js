const fs = require('fs');
const path = require('path');

async function loadFiles(directory) {
    const files = [];
    const fileNames = await fs.promises.readdir(directory);

    for (const fileName of fileNames) {
        const filePath = path.join(directory, fileName);
        const stats = await fs.promises.stat(filePath);

        if (stats.isDirectory()) {
            const subFiles = await loadFiles(filePath); 
            files.push(...subFiles);
        } else if (fileName.endsWith('.js')) {
            const command = require(filePath);
            files.push(command);
        }
    }

    return files;
}

async function loadCommands(client, directory) {
    const commandFiles = await loadFiles(directory);
    commandFiles.forEach(command => {
        client.commands.set(command.data.name, command);
    });
}

async function loadEvents(client, directory) {
    const eventFiles = await loadFiles(directory);
    eventFiles.forEach(event => {
        if (event.once) {
            client.once(event.name, (...args) => event.execute(...args, client));
        } else {
            client.on(event.name, (...args) => event.execute(...args, client));
        }
    });
}

module.exports = {
    loadCommands,
    loadEvents,
};