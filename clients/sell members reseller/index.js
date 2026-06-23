const { readdirSync, statSync } = require('fs');
require("dotenv").config();
const Discord = require('discord.js')
/////////////////////// بكجات ///////////////////////
const logAndReturn = (value) => console.log(value);
process.on("unhandledRejection", logAndReturn);
process.on("uncaughtException", logAndReturn);
process.on('uncaughtExceptionMonitor', logAndReturn);

const { Intents, Collection, Client, GuildMember, MessageActionRow, WebhookClient,MessagePayload, GatewayIntentBits, MessageSelectMenu, Modal, MessageEmbed,MessageButton, MessageAttachment, Permissions, TextInputComponent} = require('discord.js');
const chalk = require('chalk')
const {CommandCooldown, msToMinutes} = require('discord-command-cooldown');
const { createEmbed } = require('../../function/function/Embed');

 const Canvas = require('@napi-rs/canvas')
const {path , join} = require('path');
const discordTranscripts = require('discord-html-transcripts');
const settings = require('../../config/settings');
const MainServer = require('../../models/settings');
const OAuth2 = require('discord-oauth2');
const { client } = require('../../index.js');
const { لون_الامبيد } = require('../../config/settings');
const Members = require('../../models/members');
const TransferCredits = require('probot-credits-transfer')
const oauth = new OAuth2({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    redirectUri: process.env.REDIRECT_URI,
  });
  

function formatNumber(num) {
    if (num >= 1e6) {
        return (num / 1e6).toFixed(2) + 'm';
    }
    if (num >= 1e3) {
        return (num / 1e3).toFixed(2) + 'k';
    }
    return num.toFixed(2);
}

async function Bot(token, data , OurClient ) {
    const client = new Client({
        intents: 3276543,
        partials: ['MESSAGE', 'CHANNEL', 'REACTION'],
        allowedMentions: { parse: ['everyone', 'roles', 'users'], repliedUser: true }
    });



    client.on('ready', async () => {
        console.log(chalk.default.bgBlack.white(
            `Done Login Bot : ${client.user.username} ${chalk.default.bgBlack.white(
                `Owner : ${chalk.default.bgRed.white(`${data.ownerId}`)} | Server : ${chalk.default.bgRed.white(`${data.guildId}`)}`
            )}`
        ));
       
    });
    
    client.on('error', console.error);
        await client.login(token);

        // client.on('messageCreate', async (message) => {
        //     if (message.author.bot) return;
        //     if (!message.content.startsWith(settings.prefix)) return;
        //     const args = message.content.slice(settings.prefix.length).trim().split(/ +/);
        //     const command = args.shift().toLowerCase();
        //    const Data = await MainServer.findOne({})
        //    const ResellerData = Data.resellerData
        //    const Reseller = ResellerData.find(r => r.guildId === data.guildId)
        //    if (!Reseller) return
        //     if (command === '') {
        //         if (Reseller.ownerId !== message.author.id) return
        
               
        //     }
        // });
  
  

      client.on('messageCreate', async (message) => {
          if (message.author.bot) return;
          if (!message.content.startsWith(settings.prefix)) return;
          const args = message.content.slice(settings.prefix.length).trim().split(/ +/);
          const command = args.shift().toLowerCase();
         const Data = await MainServer.findOne({})
         const ResellerData = Data.resellerData
         const Reseller = ResellerData.find(r => r.guildId === data.guildId)
         if (!Reseller) return
          if (command === 'send') {
              if (Reseller.ownerId !== message.author.id) return
      
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

 


      client.on('messageCreate', async (message) => {
        if (message.author.bot) return;
        if (!message.content.startsWith(settings.prefix)) return;
        const args = message.content.slice(settings.prefix.length).trim().split(/ +/);
        const command = args.shift().toLowerCase();
       const Data = await MainServer.findOne({})
       const ResellerData = Data.resellerData
       const Reseller = ResellerData.find(r => r.guildId === data.guildId)
       if (!Reseller) return
        if (command === 'stock') {
            if (Reseller.ownerId !== message.author.id) return
    
            
        const Embed = new MessageEmbed()
        .setTitle('المخزون الموجود')
        .setDescription(`**مرحبا اعضاء السيرفر يمكنكم التحقق من مخزون الاعضاء لدينا من الاسفل \n\n الكمية : ${Reseller.coins}**`)
        .setThumbnail(message.guild.iconURL({ dynamic: true, size: 512 }))
        .setAuthor(message.guild.name, message.guild.iconURL({ dynamic: true, size: 512 }))
        .setColor(لون_الامبيد);

    await message.channel.send({ embeds: [Embed] });
           
        }
    });

 
    client.on('messageCreate', async (message) => {
        if (message.author.bot) return;
        if (!message.content.startsWith(settings.prefix)) return;
        const args = message.content.slice(settings.prefix.length).trim().split(/ +/);
        const command = args.shift().toLowerCase();
       const Data = await MainServer.findOne({})
       const ResellerData = Data.resellerData
       const Reseller = ResellerData.find(r => r.guildId === data.guildId)
       if (!Reseller) return
        if (command === 'setbank') {
            if (Reseller.ownerId !== message.author.id) return
    
            const bankId = message.mentions.users.first() || message.guild.members.cache.get(args[0])
            if (!bankId) return message.reply('**-# يجب عليك منشن البنك الي هتضيفه**')
            Reseller.bankId = bankId.id
            await Reseller.save()
            message.reply(`**✅ تم تحديث البنك بنجاح**`)
           
        }
    });


    client.on('messageCreate', async (message) => {
        if (message.author.bot) return;
        if (!message.content.startsWith(settings.prefix)) return;
        const args = message.content.slice(settings.prefix.length).trim().split(/ +/);
        const command = args.shift().toLowerCase();
       const Data = await MainServer.findOne({})
       const ResellerData = Data.resellerData
       const Reseller = ResellerData.find(r => r.guildId === data.guildId)
       if (!Reseller) return
        if (command === 'setprice') {
            if (Reseller.ownerId !== message.author.id) return
    
            const price = args[0]
            if (!price || isNaN(price)) return message.reply('**-# يجب عليك ان تكتب السعر**')
            Reseller.priceMember = price
            await Reseller.save()
            message.reply(`**✅ تم تحديث السعر بنجاح**`)
           
        }
    });
    
    client.on('messageCreate', async (message) => {
        if (message.author.bot) return;
        if (!message.content.startsWith(settings.prefix)) return;
        const args = message.content.slice(settings.prefix.length).trim().split(/ +/);
        const command = args.shift().toLowerCase();
       const Data = await MainServer.findOne({})
       const ResellerData = Data.resellerData
       const Reseller = ResellerData.find(r => r.guildId === data.guildId)
       if (!Reseller) return
        if (command === 'setlog') {
            if (Reseller.ownerId !== message.author.id) return
    
            const logChannel = message.mentions.channels.first() || message.guild.channels.cache.get(args[0])
            if (!logChannel) return message.reply('**-# يجب عليك ان تكتب الروم اللي هتضيفه**')
            Reseller.logChannel = logChannel.id
            await Reseller.save()
            message.reply(`**✅ تم تحديث الروم بنجاح**`)
           
        }
    });
    
    client.on('messageCreate', async (message) => {
        if (message.author.bot) return;
        if (!message.content.startsWith(settings.prefix)) return;
        const args = message.content.slice(settings.prefix.length).trim().split(/ +/);
        const command = args.shift().toLowerCase();
       const Data = await MainServer.findOne({})
       const ResellerData = Data.resellerData
       const Reseller = ResellerData.find(r => r.guildId === data.guildId)
       if (!Reseller) return
        if (command === 'set-ticket') {
            if (Reseller.ownerId !== message.author.id) return
    
     
            const ticketEmbed = new MessageEmbed()
            .setTitle('شراء اعضاء')
            .setDescription('**اضغط لشراء اعضاء**')
            .setThumbnail(message.guild.iconURL({ dynamic: true, size: 512 }))
            .setAuthor(message.guild.name, message.guild.iconURL({ dynamic: true, size: 512 }))
            .setColor(settings.لون_الامبيد);

            const row = new MessageActionRow().addComponents(
                new MessageButton()
                    .setCustomId('ticket_buy')
                    .setLabel('شراء اعضاء')
                    .setStyle('SECONDARY')
            );
            await message.channel.send({ embeds: [ticketEmbed], components: [row] });
           
        }
    });
    
    client.on('messageCreate', async (message) => {
        if (message.author.bot) return;
        if (!message.content.startsWith(settings.prefix)) return;
        const args = message.content.slice(settings.prefix.length).trim().split(/ +/);
        const command = args.shift().toLowerCase();
       const Data = await MainServer.findOne({})
       const ResellerData = Data.resellerData
       const Reseller = ResellerData.find(r => r.guildId === data.guildId)
       if (!Reseller) return
        if (command === 'help') {
            if (Reseller.ownerId !== message.author.id) return
    
            const Embed = new MessageEmbed()
            .setAuthor(message.guild.name, message.guild.iconURL({ dynamic: true, size: 512 }))
            .setColor(settings.لون_الامبيد)
            .setFields(
                { name : `${settings.prefix}set-ticket`, value : 'لأرسال التكت'  },
                { name : `${settings.prefix}setlog`, value : 'تعين اللوج' },
                { name : `${settings.prefix}setprice`, value : 'تحديد السعر' },
                { name : `${settings.prefix}setbank`, value : 'تحديد البنك بالايدي' },
                { name : `${settings.prefix}stock`, value : 'ستوك البوت' },
                { name : `${settings.prefix}send`, value : 'لأرسال اثبت نفسك' },
            )
         
    
          await message.channel.send({ embeds: [Embed] });
        }
    });




  client.on('interactionCreate', async (interaction) => {
    if (interaction.isButton()) {
        if (interaction.customId === 'ticket_buy') {

            const Data = await MainServer.findOne({})
            const ResellerData = Data.resellerData
            const Reseller = ResellerData.find(r => r.guildId === data.guildId)
            if (!Reseller) return

             await interaction.deferReply({ ephemeral: true });
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
    
            const Log = await client.channels.cache.get(Reseller.logChannel)
    
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
                    .setURL(`https://discord.com/oauth2/authorize?client_id=${OurClient.user.id}&permissions=1&integration_type=0&scope=bot`)
                    .setLabel('إضافة البوت')
                    .setStyle('LINK'),
    
                    new MessageButton()
                    .setCustomId('delete_ticket')
                    .setLabel('مسح التذكرة')
                    .setStyle('DANGER')
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
    }
  });


  
client.on('interactionCreate', async interaction => {
    if (!interaction.isButton()) return;

    if (interaction.customId === 'buy_members') {
        const Data = await MainServer.findOne({})
        const ResellerData = Data.resellerData
        const Reseller = ResellerData.find(r => r.guildId === data.guildId)
        if (!Reseller) return

        await interaction.reply({ content: `**عايز كام عضو؟ اكتب العدد هنا في التذكرة**` });
        const filter = response => {
            return response.author.id === interaction.user.id && !isNaN(response.content);
        };

        const collector = interaction.channel.createMessageCollector({ filter, time: 60000 });

        collector.on('collect', async (msg) => {
            const memberCount = parseInt(msg.content);

             if (isNaN(memberCount)) {
                await interaction.editReply({ content: `**يجب عليك كتابة عدد صحيح**` });
                return;
            }
       
            collector.stop();
            msg.delete()
            const allMembers = await Members.find({});
            if (memberCount > Reseller.coins) {
                await interaction.editReply({ content: `**ليس لديك عدد اعضاء كافي للشراء**` });
                return;
            }
            if (memberCount > allMembers.length) {
                await interaction.editReply({ content: `**متقدر تشتري اكتر من ${allMembers.length} عضو**` });
                return;
            }

             if (Reseller.bankId === null) {
                await interaction.editReply({ content: `**قم بالتواصل مع الادارة لأنه لم يتم تحديد البنك بعد 😀**` });
                return;
             }

             if (Reseller.priceMember === null) {
                await interaction.editReply({ content: `** قم بالتواصل مع الادارة لأنه لم يتم تحديد السعر بعد 😀**` });
                return;
             }

             const price = memberCount * Reseller.priceMember;

             const tax = Math.floor(price * (20 / 19) + 1);
            
            const embed = new MessageEmbed()
                .setTitle('عملية شراء اعضاء جارية')
                .setDescription(`**${memberCount} × ${Reseller.priceMember} = ${price}
price one member = ${Reseller.priceMember}

final price with tax = ${tax}\n\n\`\`\`#credit ${Reseller.bankId} ${tax}\`\`\`**`)
                .setTimestamp()
                .setFooter(interaction.user.username, interaction.user.displayAvatarURL({ dynamic: true }))
                .setAuthor(interaction.user.username, interaction.user.displayAvatarURL({ dynamic: true }))
                .setThumbnail(interaction.user.displayAvatarURL({ dynamic: true }))
                .setColor(لون_الامبيد);
           
            await interaction.editReply({content : ` ` , embeds: [embed] });

            const options = {
                botId: '282859044593598464', // ايدي بوت البروبوت
                userId: Reseller.bankId, // ايدي البنك الي هتوصله الفلوس
                amount: price, 
                timeout: 60000, // مدة العملية (بالميلي ثانية)
                channel: interaction.channel, // الروم الحالي
            };
            const randomString = generateRandomString();
            const result = await TransferCredits(options);

            if (result) {

                await Data.orders.push({
                state : randomString ,
                amount : memberCount,
                Type : 'اعضاء', 
                UserBuyer : interaction.user.id,
                Channel : interaction.channel.id
                })

                Reseller.coins -= price
                await Reseller.save()

                await Data.save();
                embed.setTitle('عملية شراء اعضاء ناجحة');
                embed.setDescription(`\`\`\`تم بنجاح التحويل يمكنك فتح الرابط للحصول علي الاعضاء ✅\`\`\``);
                embed.setColor('GREEN');

                const redirectUri = encodeURIComponent(settings.redirectUriBuy);
                const link = `https://discord.com/oauth2/authorize?client_id=${OurClient.user.id}&permissions=8&response_type=code&redirect_uri=${redirectUri}&integration_type=0&scope=bot+identify+guilds&state=${randomString}`;
                
                const buttons = new MessageActionRow().addComponents(
                    new MessageButton()
                    .setLabel('ادخال الاعضاء ؟')
                    .setStyle('LINK')
                    .setURL(link)
                );

                await interaction.editReply({ embeds: [embed], components: [buttons] });
                await interaction.user.send({ embeds: [embed] , components: [buttons]});

            const logEmbed = new MessageEmbed()
            .setTitle('📝 لوج شراء الأعضاء')
            .setDescription(`**🎯 تفاصيل عملية الشراء**\n
            🧑‍💻 **المشتري**: <@${interaction.user.id}>\n
            💸 **عدد الأعضاء**: ${memberCount}\n
            💰 **السعر لكل عضو**: ${Data.memberPrice}\n
            📊 **السعر النهائي مع الضريبة**: ${tax}\n
            📅 **وقت العملية**: <t:${Math.floor(Date.now() / 1000)}:F>\n
            🏦 **البنك**: ${Data.bankId}\n`)
            .setThumbnail(interaction.user.displayAvatarURL({ dynamic: true }))
            .setAuthor(interaction.user.username, interaction.user.displayAvatarURL({ dynamic: true }))
            .setColor(لون_الامبيد)
            .setFooter(interaction.user.username, interaction.user.displayAvatarURL({ dynamic: true }))
            .setTimestamp();

        const logChannel = client.channels.cache.get(Reseller.logChannel);
        if (logChannel) {
            await logChannel.send({ embeds: [logEmbed] });
        }

            } else {

                embed.setTitle('عملية شراء اعضاء فاشلة');
                embed.setDescription(`\`\`\`لم يتم تحويل المبلغ بنجاح حاول مرة اخرى ✅\`\`\``);
                embed.setColor('RED');
                await interaction.editReply({ embeds: [embed] });

            }

         
        });


        collector.on('end', collected => {
            if (collected.size === 0) {
                interaction.deleteReply();
            }
        });
    }
});


function generateRandomString(length = 16) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    
    return result;
}


client.on('interactionCreate', async (interaction) => {
    if (!interaction.isButton()) return;
    if (interaction.customId === 'delete_ticket') {
      
        await interaction.reply({ content: 'جاري مسح التذكرة', ephemeral: true });

        setTimeout( async () => {
            await interaction.channel.delete();
        }, 3000);
    }
});







        return client; 
    }
    
    module.exports = Bot;