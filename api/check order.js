const { client, app, settings } = require('../../index');
const { Intents, MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');
const OAuth2 = require('discord-oauth2');
const Members = require('../../models/members');
const ServerSettings = require('../../models/settings');
const { default: chalk } = require('chalk');
const path = require('path');
const { لون_الامبيد } = require('../../config/settings');

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isButton()) return;

    if (interaction.customId.startsWith(`Check_Order_`)) {
        const state = interaction.customId.split('_')[2];
        const allMembers = await Members.find({});
        const data = await ServerSettings.findOne({});

        const order = data.orders.find((e) => e.state === state);
        if (!order) return interaction.reply({ content: 'Invalid order ID', ephemeral: true });


        const userBuyer = order.UserBuyer;
        const amount = order.amount;
        const typeTokens = order.Type;
        const addedCount = order.addedCount || 0; 
        const remainingCount = order.remainingCount || amount - addedCount; 

        // بيانات السيرفر
        const guild = await client.guilds.fetch(order.serverId);
        const guildName = guild.name;
        const guildId = guild.id;
        const guildMemberCount = guild.memberCount;
        const guildIconURL = guild.iconURL ? guild.iconURL({ dynamic: true }) : null;


      
        const orderEmbed = new MessageEmbed()
        .setColor(لون_الامبيد)
        .setTitle('تفاصيل الطلب')
        .addFields(
            { name: '👤 الشخص المشتري', value: userBuyer || 'غير متوفر', inline: true },
            { name: '📦 نوع الطلب', value: typeTokens || 'غير محدد', inline: true },
            { name: '📋 العدد المطلوب', value: `${amount || 0} عضو`, inline: true },
            { name: '✅ عدد الأعضاء المضافين', value: `${addedCount || 0} عضو`, inline: true },
            { name: '⏳ الأعضاء المتبقيين', value: `${remainingCount || 0} عضو`, inline: true },
            { name: '📛 اسم السيرفر', value: guildName || 'غير متوفر', inline: true },
            { name: '🆔 أيدي السيرفر', value: guildId || 'غير متوفر', inline: true },
            { name: '👥 العدد الحالي للأعضاء', value: `${guildMemberCount || 0} عضو`, inline: true },
            { 
                name: '📣 حالة ادخال الأعضاء', 
                value: `${order.status === false ? 'تم الانتهاء منه' : (order.join === true ? 'يعمل الان' : 'تم ايقافه مؤقتا')}`, 
                inline: true 
            },
            
        )
        .setFooter({ text: 'تحقق من الطلب', iconURL: guildIconURL || '' });


        interaction.reply({ embeds: [orderEmbed], ephemeral: true });
    }
});
