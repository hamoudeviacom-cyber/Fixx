const { readdirSync, statSync } = require("fs");
const { join } = require("path");

function loadCommands(directory) {
  readdirSync(directory).forEach(file => {
    const fullPath = join(directory, file);
    const isDirectory = statSync(fullPath).isDirectory();

    if (isDirectory) {
      loadCommands(fullPath);
    } else if (file.endsWith('.js')) {
      const command = require(fullPath);
      
    }
  });
}

function initializeCommands() {
  const commandsDirectory = join(__dirname, './../commands');
  loadCommands(commandsDirectory);
}


module.exports = initializeCommands;
