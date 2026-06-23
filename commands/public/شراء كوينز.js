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
const TransferCredits = require('probot-credits-transfer')

client.on('messageCreate', async (message) => {
    if (message.author.bot) return;
    if (!message.content.startsWith(settings.prefix)) return;
    const args = message.content.slice(settings.prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();
    if (command === 'buycoins') {
    if (!message.channel.id === settings.channelBuyCoins) return
      const Data = await ServerSettings.findOne({})
      const Datamembers = await Members.find()
      const resellerData = Data.resellerData
      const Reseller = resellerData.find(r => r.ownerId === message.author.id)
      if (!Reseller) return

      const amount = args[0]
      const price1coins = Data.memberPriceReseller 
      if (!amount || isNaN(amount)) return message.reply(`اكتب الكوينز اللي تريد شرائها`)
      if (Datamembers.length < amount) return message.reply(`لا يوجد ${amount} شخص كافيه للشراء , يمكنك اضافه فقط ${Datamembers.length} شخص`)
     const totalPrice = amount * price1coins
     const tax = Math.floor(totalPrice * (20 / 19) + 1);

     const options = {
        botId: '282859044593598464', // ايدي بوت البروبوت
        userId: Data.bankId, // ايدي البنك الي هتوصله الفلوس
        amount: totalPrice, 
        timeout: 60000, // مدة العملية (بالميلي ثانية)
        channel: message.channel, // الروم الحالي
    };

   const msg = await message.reply(`**c ${Data.bankId} ${tax}\n\n-# انسخ كود التحويل لأتمام عملية التحويل**`)

    const result = await TransferCredits(options);

    if (result) {
        await msg.edit(`✅ تمت عملية التحويل بنجاح وتم اضافة الكوينز بنجاح`)
        Reseller.coins += amount
        Reseller.save()
    } else {
        await msg.edit(`❌ لم تتم عملية التحويل`)
        
    }

    }
});
