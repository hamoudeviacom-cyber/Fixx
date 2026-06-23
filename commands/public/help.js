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

client.on('messageCreate', async (message) => {
    if (message.author.bot) return;
    if (!message.content.startsWith(settings.prefix)) return;

    const args = message.content.slice(settings.prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    if (command === 'help') {
        if (!settings.Owners.includes(message.author.id)) return;

        const embed = new MessageEmbed()
            .setColor(لون_الامبيد)
            .setTitle('قائمة أوامر البوت')
            .setAuthor(message.guild.name, message.guild.iconURL({ dynamic: true, size: 512 }))
            .setThumbnail(message.guild.iconURL({ dynamic: true, size: 512 }))
            .addFields(
                { name: `${settings.prefix}set-bank`, value: 'تعيين البنك الذي سيتم استخدامه لإجراء المعاملات'  },
                { name: `${settings.prefix}set-price`, value: 'تعيين سعر العضو الواحد' },
                { name: `${settings.prefix}set-log`, value: 'تعيين اللوج لتوثيق جميع العمليات' },
                { name: `${settings.prefix}verify`, value: 'لأرسال امبيد اثبت نفسك' },
                { name: `${settings.prefix}join`, value: 'لأضافة اعضاء بشكل يدوي للسيرفر' },
                { name: `${settings.prefix}stock`, value: 'عرض المخزون المتاح من الاعضاء' }, 
                { name: `${settings.prefix}setup-ticket`, value: 'انشاء تذكرة البيع' },
                { name: `${settings.prefix}give-reseller`, value: 'اعطاء ريسيلر' },
                { name: `${settings.prefix}set-price-reseller`, value: 'تغير سعر الريسيلر' },
                { name: `${settings.prefix}delete-reseller`, value: 'حذف ريسيلر' },
                { name: `${settings.prefix}buycoins`, value: 'شراء كوينز' },
                { name: `${settings.prefix}set-coins`, value: 'لاضافه او ازالة الكوينز' },
            )
            
            .setTimestamp();


        await message.reply({ embeds: [embed] });
    }
});