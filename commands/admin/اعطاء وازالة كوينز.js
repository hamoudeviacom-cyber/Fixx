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
const ServerSettings = require('../../models/settings');


client.on('messageCreate', async (message) => {
    if (message.author.bot) return;
    if (!message.content.startsWith(settings.prefix)) return;
    const args = message.content.slice(settings.prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    if (command === 'set-coins') {
        if (!settings.Owners.includes(message.author.id)) return;
        const Data = await ServerSettings.findOne({});
        const ResellerData = Data.resellerData;

        const user = message.mentions.users.first() || message.guild.members.cache.get(args[0]);
        if (!user) return message.reply('منشن شخص او حط ايدي الشخص');

        const type = args[1];
        if (!type || !["add", "remove"].includes(type)) return message.reply('حط add او remove');

        const amount = parseInt(args[2], 10);
        if (isNaN(amount)) return message.reply('حط عدد كوينز صحيح');

        const Reseller = ResellerData.find(r => r.ownerId === user.id);
        if (!Reseller) return message.reply('لا يملك ريسيلر');

        Reseller.coins = Reseller.coins || 0;

        if (type === 'add') {
            Reseller.coins += amount;
            await Data.save();
            message.reply(`تم اضافه ${amount} كوينز للريسيلر بنجاح`);
        } else if (type === 'remove') {
            if (Reseller.coins < amount) return message.reply('لا يوجد كوينز كافية للريسيلر');
            Reseller.coins -= amount;
            await Data.save();
            message.reply(`تم حذف ${amount} كوينز من الريسيلر بنجاح`);
        }
    }
});
