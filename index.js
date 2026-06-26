// =============================================
// Railway-only env reading - main bot
// =============================================
const fs = require('fs');
const Discord = require('discord.js');

// ============== ENV DEBUG ==============
console.log('=== [MAIN BOT] ENV DEBUG START ===');
console.log('TOKEN:', process.env.TOKEN ? `SET (length: ${process.env.TOKEN.length})` : '❌ MISSING');
console.log('MONGODB_URI:', process.env.MONGODB_URI ? 'SET' : '❌ MISSING');
console.log('CLIENT_ID:', process.env.CLIENT_ID ? `SET (${process.env.CLIENT_ID})` : '❌ MISSING');
console.log('CLIENT_SECRET:', process.env.CLIENT_SECRET ? `SET (length: ${process.env.CLIENT_SECRET.length})` : '❌ MISSING');
console.log('REDIRECT_URI:', process.env.REDIRECT_URI || '❌ MISSING');
console.log('=== [MAIN BOT] ENV DEBUG END ===');

// التحقق من الـ env vars الأساسية قبل ما نبدأ
const requiredEnvVars = {
  TOKEN: process.env.TOKEN,
  MONGODB_URI: process.env.MONGODB_URI,
};

const missingVars = Object.entries(requiredEnvVars)
  .filter(([key, value]) => !value)
  .map(([key]) => key);

if (missingVars.length > 0) {
  console.error(`[FATAL] Missing required env vars: ${missingVars.join(', ')}`);
  console.error('Please set them in Railway Variables tab.');
  process.exit(1);
}

const client = new Discord.Client({
    intents: 3276543,
    partials: ['MESSAGE', 'CHANNEL', 'REACTION'],
    allowedMentions: { parse: ['everyone', 'roles', 'users'], repliedUser: true }
});

/////////////////////// بكجات ///////////////////////
const { Intents, Collection, Client, GuildMember, MessageActionRow, WebhookClient, MessagePayload, GatewayIntentBits, MessageSelectMenu, Modal, MessageEmbed, MessageButton, MessageAttachment, Permissions, TextInputComponent } = require('discord.js');
const chalk = require('chalk');
const mongoose = require('mongoose');
/////////////////////// بكجات ///////////////////////

const settings = require('./config/settings.js');
const app = require('./function/Express.js')(settings.port, chalk);
const prefix = settings.prefix;
module.exports = { app, client, prefix, settings };

require('./SlashCommands/SlashCommand.js');
require('./function/function/ready.js')(client, chalk);
const initializeCommands = require('./function/commands.js');
initializeCommands();
app.set('views', './views');
app.set('view engine', 'ejs');

const logAndReturn = (value) => console.log(value);
process.on("unhandledRejection", logAndReturn);
process.on("uncaughtException", logAndReturn);
process.on('uncaughtExceptionMonitor', logAndReturn);

// زيادة الـ MaxListeners عشان عندنا أكتر من 10 listeners في كوماندات مختلفة
client.setMaxListeners(50);

///////////////// Express ////////////////
const { join, path } = require('path');
const Members = require('./models/members.js');
const Bot = require('./clients/sell members reseller/index.js');

function requireAllApiFiles(app, directory) {
  fs.readdirSync(directory).forEach(file => {
    const filePath = join(directory, file);
    const isDirectory = fs.statSync(filePath).isDirectory();
    if (isDirectory) {
      requireAllApiFiles(app, filePath);
    } else if (file.endsWith('.js')) {
      const apiModule = require(filePath);
      if (typeof apiModule === 'function') {
        apiModule(app);
      }
    }
  });
}

const apiDirectoryPath = join(__dirname, 'api');
requireAllApiFiles(app, apiDirectoryPath);

// الاتصال بـ MongoDB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => {
    console.error('[MongoDB Error]', err);
    process.exit(1);
  });

const ServerSettings = require('./models/settings.js');

async function startAllBots() {
  const Data = await ServerSettings.findOne({});
  const resellerData = Data.resellerData;

  for (const reseller of resellerData) {
    await Bot(reseller.botToken, reseller, client);
  }

  console.log('All bots started ' + resellerData.length);
}

startAllBots();

// تسجيل الدخول للبوت الأساسي
client.login(process.env.TOKEN);