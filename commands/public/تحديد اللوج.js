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



client.on('messageCreate', async (message) => {
    if (message.author.bot) return;
    if (!message.content.startsWith(settings.prefix)) return;
    const args = message.content.slice(settings.prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    if (command === 'set-log') {
        if (!settings.Owners.includes(message.author.id)) return

        const log = args[0];
        if (!log) {
            return message.reply('حط ايدي البنك بشكل كويس');
        }

        const Data = await ServerSettings.findOne({});

        if (!Data) {
            const newData = new ServerSettings({
                logChannel: log
            });
            await newData.save();
        } else {
            Data.logChannel = log;
            await Data.save();
        }

        message.reply('تم تحديد اللوج بنجاح ✅');

        const logChannel = client.channels.cache.get(log);
        if (logChannel) {
            const logEmbed = new MessageEmbed()
                .setColor(لون_الامبيد)
                .setTitle('🔧 تحديث اللوج')
                .addFields(
                    { name: '👤 المسؤول', value: `<@${message.author.id}>`, inline: true },
                    { name: '🔗 ايدي روم اللوج الجديد', value: log, inline: true },
                    { name: '📅 وقت التحديث', value: `<t:${Math.floor(Date.now() / 1000)}:F>`, inline: true }
                )
                .setFooter({ text: 'لوج', iconURL: message.guild.iconURL({ dynamic: true }) })
                .setTimestamp();

            logChannel.send({ embeds: [logEmbed] });
        }
    }
});