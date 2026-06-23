const { client, settings } = require('../../index');
/////////////////////// بكجات ///////////////////////
const { Intents, Collection, Client, GuildMember, MessageActionRow, WebhookClient, MessagePayload, GatewayIntentBits, MessageSelectMenu, Modal, MessageEmbed, MessageButton, MessageAttachment, Permissions, TextInputComponent } = require('discord.js');
const chalk = require('chalk');
const { CommandCooldown, msToMinutes } = require('discord-command-cooldown');
const { createEmbed } = require('../../function/function/Embed');
const checkCredits = require('../../function/function/checkCredits');
const Canvas = require('@napi-rs/canvas');
const { path, join } = require('path');
const moment = require('moment');
const OAuth2 = require('discord-oauth2');
const { لون_الامبيد } = require('../../config/settings');
const Members = require('../../models/members');
const ServerSettings = require('../../models/settings');
const TransferCredits = require('probot-credits-transfer')

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isButton()) return;
    if (interaction.customId === 'buy_reseller') {
        const Data = await ServerSettings.findOne({});
        const tax = Math.floor(Data.resellerPrice * (20 / 19) + 1);

        const options = {
            botId: '282859044593598464', // ايدي بوت البروبوت
            userId: Data.bankId, // ايدي البنك الي هتوصله الفلوس
            amount: Data.resellerPrice,
            timeout: 60000, // مدة العملية (بالميلي ثانية)
            channel: interaction.channel, // الروم الحالي
        };
       console.log(options)
        const msg = await interaction.reply({ content: `**c ${Data.bankId} ${tax}\n\n-# انسخ كود التحويل لأتمام عملية التحويل**`, fetchReply: true });

        const result = await TransferCredits(options);
        if (result) {
            const row = new MessageActionRow()
                .addComponents(
                    new MessageButton().setCustomId('acceptReseller').setLabel('استلام الريسيلر').setStyle('SUCCESS')
                );
             await interaction.editReply({content : `تمت عملية التحويل بنجاح شيك خاصك`})
            await interaction.user.send({ content: `تم شراء ريسيلر بنجاح قم بتعبئة البيانات من خلال الزر بالاسفل`, components: [row] });
        } else {
            await msg.edit(`❌ لم تتم عملية التحويل`);
        }
    }
});