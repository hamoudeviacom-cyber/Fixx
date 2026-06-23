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
const Bot = require('../../clients/sell members reseller');


client.on('messageCreate', async (message) => {
    if (message.author.bot) return;
    if (!message.content.startsWith(settings.prefix)) return;
    const args = message.content.slice(settings.prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    if (command === 'delete-reseller') {
        if (!settings.Owners.includes(message.author.id)) return

        const user = message.mentions.users.first() || message.guild.members.cache.get(args[0])
        if (!user) return message.reply('منشن شخص او حط ايدي الشخص'); 

        const Data = await ServerSettings.findOne({})
        const ResellerData = Data.resellerData
        const Reseller = ResellerData.find(r => r.ownerId === user.id)
        if (!Reseller) return message.reply('لا لا يملك ريسيلر')

        await Reseller.deleteOne()
        await Data.save() 
        message.reply(`تم حذف الريسيلر بنجاح`)

       
    }
});
