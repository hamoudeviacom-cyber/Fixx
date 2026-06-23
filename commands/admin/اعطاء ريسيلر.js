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

    if (command === 'give-reseller') {
        if (!settings.Owners.includes(message.author.id)) return

        const user = message.mentions.users.first() || message.guild.members.cache.get(args[0])
        if (!user) return message.reply('منشن شخص او حط ايدي الشخص')

        const row = new MessageActionRow()
        .addComponents(
            new MessageButton().setCustomId('acceptReseller').setLabel('استلام الريسيلر').setStyle('SUCCESS')
        )

        const Embed = new MessageEmbed()
        .setAuthor(user.username, user.displayAvatarURL({ dynamic: true, size: 512 }))
        .setThumbnail(user.displayAvatarURL({ dynamic: true, size: 512 }))
        .setDescription(`** ${user} ** تم اعطائك ريسيلر في السيرفر الان قم بالضغط علي الزر ادناه لاستلامه`)
        .setColor(لون_الامبيد)

       await user.send({ embeds: [Embed], components: [row] })
       message.reply(`تم ارسال الريسيلر للشخص ${user}`)
    }
});

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isButton()) return;
    if (interaction.customId === 'acceptReseller') {
       
        const Data = await ServerSettings.findOne({});

        const ResellerData = Data.resellerData
      

        const modal = new Modal()
        .setCustomId('resellerModal')
        .setTitle('استلام الريسيلر')

        const ownerId = new TextInputComponent()
        .setCustomId('ownerId')
        .setLabel('ايدي المالك')
        .setStyle('SHORT')
        .setPlaceholder('ايدي المالك')
        .setRequired(true)

        const botToken = new TextInputComponent()
        .setCustomId('botToken')
        .setLabel('توكن البوت')
        .setStyle('SHORT')
        .setPlaceholder('توكن البوت')
        .setRequired(true)

        const guildId = new TextInputComponent()    
        .setCustomId('guildId')
        .setLabel('ايدي السيرفر')
        .setStyle('SHORT')
        .setPlaceholder('ايدي السيرفر')
        .setRequired(true)

        const row = new MessageActionRow().addComponents(ownerId)
        const row2 = new MessageActionRow().addComponents(botToken)
        const row3 = new MessageActionRow().addComponents(guildId)
        modal.addComponents(row, row2, row3);

        await interaction.showModal(modal)
    }
})

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isModalSubmit()) return;
    if (interaction.customId === 'resellerModal') {
        const ownerId = interaction.fields.getTextInputValue('ownerId');
        const botToken = interaction.fields.getTextInputValue('botToken');
        const guildId = interaction.fields.getTextInputValue('guildId');
 
        const Data = await ServerSettings.findOne({});
        const ResellerData = Data.resellerData;

        if (ResellerData.find(r => r.ownerId === ownerId && r.botToken === botToken && r.guildId === guildId)) {
            return interaction.reply('هذا الريسيلر موجود بالفعل');
        }

      
        try {
            const tempClient = new Client({ intents: 32767 });

            try {
                await tempClient.login(botToken);

                const botId = tempClient.user.id; 
            } catch (error) {
                await interaction.reply(`مشكله : ${error}`);
                return;
            }

            ResellerData.push({ 
                ownerId, 
                botToken,
                guildId, 
                botId: tempClient.user.id,
            });
            await Data.save();

            const DataReseller = await ResellerData.find(r => r.ownerId === ownerId && r.botToken === botToken && r.guildId === guildId);
            await Bot(botToken, DataReseller, client);

            const button = interaction.message.components[0].components[0];
            button.setDisabled(true);
            button.setLabel('تم تشغيل البوت بنجاح');

            const Embed = new MessageEmbed()
                .setDescription(`**تم تشغيل البوت بنجاح**`)
                .setColor(لون_الامبيد);
            await interaction.update({ embeds: [Embed], components: [interaction.message.components[0]] });

        } catch (error) {
            console.error('Error logging in or processing bot:', error);
            return interaction.reply('حدث خطأ أثناء تسجيل الدخول أو معالجة البوت. يرجى التحقق من التوكن والمحاولة مرة أخرى.');
        }
    }
});

