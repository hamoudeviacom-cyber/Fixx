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
const Members = require('../../models/members');
const ServerSettings = require('../../models/settings');
const oauth = new OAuth2({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    redirectUri: process.env.REDIRECT_URI,
      scope: 'guilds',
});

client.on('messageCreate', async (message) => {
    if (message.author.bot) return;
    if (!message.content.startsWith(settings.prefix)) return;
    const args = message.content.slice(settings.prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    if (command === 'set-price') {
        if (!settings.Owners.includes(message.author.id)) return

        const price = parseInt(args[0]);
        if (isNaN(price)) {
            return message.reply('حط سعر بشكل كويس للعضو الواجد');
        }

        const Data = await ServerSettings.findOne({});

        if (!Data) {
            // new data 
            const newData = new ServerSettings({
                memberPrice: price
            });
            await newData.save();
        } else {
            Data.memberPrice = price;
            await Data.save();
        }

        message.reply('تم تغيير السعر بنجاح ✅');

        const logChannel = client.channels.cache.get(Data.logChannel);
        if (logChannel) {
            const logEmbed = new MessageEmbed()
                .setColor(لون_الامبيد) 
                .setTitle('💸 تحديث سعر العضو')
                .addFields(
                    { name: '👤 المسؤول', value: `<@${message.author.id}>`, inline: true },
                    { name: '💰 السعر الجديد للعضو', value: `${price}`, inline: true },
                    { name: '📅 وقت التحديث', value: `<t:${Math.floor(Date.now() / 1000)}:F>`, inline: true }
                )
                .setFooter({ text: 'لوج تحديثات الأسعار', iconURL: message.guild.iconURL({ dynamic: true }) })
                .setTimestamp();

            logChannel.send({ embeds: [logEmbed] });
        }
    }
});