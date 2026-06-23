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


const activeSales = new Map();

client.on('interactionCreate', async interaction => {
    if (!interaction.isButton()) return;

    if (interaction.customId === 'buy_members') {
        if (activeSales.has(interaction.user.id)) {
            await interaction.reply({
                content: `**لديك عملية شراء جارية بالفعل. هل تود إلغائها؟**`,
                components: [
                    new MessageActionRow().addComponents(
                        new MessageButton()
                            .setCustomId('cancel_sale')
                            .setLabel('إلغاء العملية')
                            .setStyle('DANGER')
                    )
                ],
                ephemeral: true
            });
            return;
        }

        activeSales.set(interaction.user.id, true);

        await interaction.reply({
            content: `**عايز كام عضو؟ اكتب العدد هنا في التذكرة**`
        });

        const Data = await ServerSettings.findOne({});
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
            msg.delete();

            const allMembers = await Members.find({});

            if (memberCount > allMembers.length) {
                await interaction.editReply({ content: `**متقدرش تشتري أكتر من ${allMembers.length} عضو**` });
                activeSales.delete(interaction.user.id); 
                return;
            }

            if (Data.bankId === null) {
                await interaction.editReply({ content: `**قم بالتواصل مع الإدارة لأنه لم يتم تحديد البنك بعد 😀**` });
                activeSales.delete(interaction.user.id);
                return;
            }

            if (Data.memberPrice === null) {
                await interaction.editReply({ content: `**قم بالتواصل مع الإدارة لأنه لم يتم تحديد السعر بعد 😀**` });
                activeSales.delete(interaction.user.id);
                return;
            }

            const price = memberCount * Data.memberPrice;
            const tax = Math.floor(price * (20 / 19) + 1);

            const embed = new MessageEmbed()
                .setTitle('عملية شراء أعضاء جارية')
                .setDescription(`**${memberCount} × ${Data.memberPrice} = ${price} final price with tax = ${tax}\n\n\`\`\`#credit ${Data.bankId} ${tax}\`\`\`**`)
                .setTimestamp()
                .setFooter(interaction.user.username, interaction.user.displayAvatarURL({ dynamic: true }))
                .setAuthor(interaction.user.username, interaction.user.displayAvatarURL({ dynamic: true }))
                .setColor('BLUE');

            await interaction.editReply({ content: ` `, embeds: [embed] });

            const data = {
                messageOrInteraction: interaction,
                price: price,
                time: 180000,
                bank: Data.bankId,
                probot: settings.Probot,
            };

            const { success, collected } = await checkCredits(data);

            if (success && collected) {
                embed.setTitle('عملية شراء أعضاء ناجحة');
                embed.setDescription(`**تم بنجاح التحويل، يمكنك فتح الرابط للحصول على الأعضاء ✅**`);
                embed.setColor('GREEN');

                const redirectUri = encodeURIComponent(settings.redirectUriBuy);
                const link = `https://discord.com/oauth2/authorize?client_id=${client.user.id}&permissions=8&response_type=code&redirect_uri=${redirectUri}&integration_type=0&scope=bot+identify+guilds`;

                const buttons = new MessageActionRow().addComponents(
                    new MessageButton()
                        .setLabel('إدخال الأعضاء')
                        .setStyle('LINK')
                        .setURL(link)
                );

                await interaction.editReply({ embeds: [embed], components: [buttons] });
                await interaction.user.send({ embeds: [embed], components: [buttons] });

                activeSales.delete(interaction.user.id); 
            } else {
                embed.setTitle('عملية شراء أعضاء فاشلة');
                embed.setDescription(`**لم يتم تحويل المبلغ بنجاح، حاول مرة أخرى ✅**`);
                embed.setColor('RED');
                await interaction.editReply({ embeds: [embed] });

                activeSales.delete(interaction.user.id); 
            }
        });

        collector.on('end', collected => {
            if (collected.size === 0) {
                interaction.deleteReply();
                activeSales.delete(interaction.user.id);
            }
        });
    }

    if (interaction.customId === 'cancel_sale') {
        if (activeSales.has(interaction.user.id)) {
            activeSales.delete(interaction.user.id); 
            await interaction.update({ content: `**تم إلغاء العملية الجارية بنجاح.**`, components: [] });
        }
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
