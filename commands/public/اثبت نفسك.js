const { client  , settings} = require('../../index')
/////////////////////// بكجات ///////////////////////
const { Intents, Collection, Client, GuildMember, MessageActionRow, WebhookClient,MessagePayload, GatewayIntentBits, MessageSelectMenu, Modal, MessageEmbed,MessageButton, MessageAttachment, Permissions, TextInputComponent} = require('discord.js');
const chalk = require('chalk')
const {CommandCooldown, msToMinutes} = require('discord-command-cooldown');
const { createEmbed } = require('../../function/function/Embed');
const checkCredits = require('../../function/function/checkCredits');
 const Canvas = require('@napi-rs/canvas')
const {path , join} = require('path');
const moment = require('moment');
const OAuth2 = require('discord-oauth2');
const { لون_الامبيد } = require('../../config/settings');

const oauth = new OAuth2({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    redirectUri: process.env.REDIRECT_URI,
  });
  

  client.on('messageCreate', async (message) => {
      if (message.author.bot) return;
      if (!message.content.startsWith(settings.prefix)) return;
      const args = message.content.slice(settings.prefix.length).trim().split(/ +/);
      const command = args.shift().toLowerCase();
  
      if (command === 'send') {
          if (!settings.Owners.includes(message.author.id)) return
  
        const Embed = new MessageEmbed()
          .setTitle('اثبت نفسك')
          .setDescription('**اضغط الزر لتحقق **')
          .setThumbnail(message.guild.iconURL({ dynamic: true, size: 512 }))
          .setAuthor(message.guild.name, message.guild.iconURL({ dynamic: true, size: 512 }))
          .setColor(لون_الامبيد);

          const authUrl = oauth.generateAuthUrl({
            scope: ['identify' , 'guilds.join' , 'guilds'],
            responseType: 'code',
          });

          const row = new MessageActionRow().addComponents(
            new MessageButton()
              .setURL(authUrl)
              .setLabel('اثبت نفسك')
              .setStyle('LINK')
          );

        await message.channel.send({ embeds: [Embed] , components: [row] });
      }
  });



