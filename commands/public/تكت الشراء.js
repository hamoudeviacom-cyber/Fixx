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

    if (command === 'setup-ticket') {
        if (!settings.Owners.includes(message.author.id)) return

        const embed = new MessageEmbed()
            .setTitle('تكت الشراء')
            .setDescription('**اضغط على الزر ليتم انشاء تذكرة**')
            .setThumbnail(message.guild.iconURL({ dynamic: true, size: 512 }))
            .setAuthor(message.guild.name, message.guild.iconURL({ dynamic: true, size: 512 }))
            .setColor(لون_الامبيد);

        const row = new MessageActionRow().addComponents(
            new MessageButton()
                .setCustomId('create_ticket')
                .setLabel('إنشاء تذكرة')
                .setStyle('SUCCESS')
        );

        await message.channel.send({ embeds: [embed], components: [row] });
    }
});




client.on('interactionCreate', async (interaction) => {
    if (!interaction.isButton()) return;

    if (interaction.customId === 'create_ticket') {
        await interaction.deferReply({ ephemeral: true });
        const guild = interaction.guild;
        const Data = await ServerSettings.findOne({});
        let category = guild.channels.cache.find(channel => 
            channel.type === 'GUILD_CATEGORY' && channel.name === 'members ticket'
        );

        if (!category || category.children.size >= 50) {
            category = await guild.channels.create('members ticket', {
                type: 'GUILD_CATEGORY'
            });
        }

        const ticketChannel = await guild.channels.create(`ticket-${interaction.user.username}`, {
            type: 'GUILD_TEXT',
            parent: category.id,
            permissionOverwrites: [
                {
                    id: guild.id,
                    deny: ['VIEW_CHANNEL'] 
                },
                {
                    id: interaction.user.id,
                    allow: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'ATTACH_FILES' , 'USE_APPLICATION_COMMANDS']
                }
            ]
        });

        const Log = await client.channels.cache.get(Data.logChannel)

        const embed = new MessageEmbed()
            .setColor(لون_الامبيد)
            .setThumbnail(guild.iconURL({ dynamic: true, size: 512 }))
            .setAuthor(guild.name, guild.iconURL({ dynamic: true, size: 512 }))
            .setTitle('تذكرة شراء اعضاء')
            .setDescription(`**مرحبا ${interaction.user} 😍 \n\n- اختار زرار شراء الاعضاء لو عايز تشتري بس قبلها ضيف البوت \n- ضيف البوت قبل الشراء من خلال زرار اضافة البوت\n- اختار زرار فحص سيرفرك عشان تعرف تقدر تضيف كام عضو لسيرفرك**`)
            .setTimestamp();

        const row = new MessageActionRow().addComponents(
            new MessageButton()
                .setCustomId('buy_members')
                .setLabel('شراء الأعضاء')
                .setStyle('PRIMARY'),
            new MessageButton()
                .setCustomId('check_server')
                .setLabel('فحص سيرفرك')
                .setStyle('SECONDARY'),
            new MessageButton()
                .setURL(`https://discord.com/oauth2/authorize?client_id=${client.user.id}&permissions=1&integration_type=0&scope=bot`)
                .setLabel('إضافة البوت')
                .setStyle('LINK'),
            new MessageButton()
                .setCustomId('buy_reseller')
                .setLabel('شراء الريسيلر')
                .setStyle('SUCCESS')

                new MessageButton()
                .setCustomId('delete_ticket')
                .setLabel('مسح التذكرة')
                .setStyle('DANGER'), 
        );

        await ticketChannel.send({ content: `<@${interaction.user.id}>`, embeds: [embed], components: [row] });

       
        await interaction.editReply({ content: `تم إنشاء تذكرتك بنجاح : ${ticketChannel}`, ephemeral: true });

        setTimeout( async () => {
            await interaction.deleteReply();
        }, 3000);

        if (Log) {
            const logEmbed = new MessageEmbed()
                .setColor(لون_الامبيد)
                .setTitle('تم إنشاء تذكرة جديدة')
                .addFields(
                    { name: '👤 أنشأ التذكرة', value: `<@${interaction.user.id}>`, inline: true },
                    { name: '🆔 ايدي التذكرة', value: ticketChannel.id, inline: true },
                    { name: '📅 وقت الإنشاء', value: `<t:${Math.floor(Date.now() / 1000)}:F>`, inline: true },
                    { name: '📄 اسم التذكرة', value: ticketChannel.name, inline: true }
                )
                .setFooter({ text: 'لوج تذاكر الاعضاء الخفم', iconURL: guild.iconURL({ dynamic: true }) })
                .setTimestamp();

            Log.send({ embeds: [logEmbed] });
        }

    }
});


client.on('interactionCreate', async (interaction) => {
    if (!interaction.isButton()) return;
    if (interaction.customId === 'delete_ticket') {
      
        await interaction.reply({ content: 'جاري مسح التذكرة', ephemeral: true });

        setTimeout( async () => {
            await interaction.channel.delete();
        }, 3000);
    }
});