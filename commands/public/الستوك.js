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

    if (command === 'stock') {
        if (!settings.Owners.includes(message.author.id)) return;

        const allAccounts = await Members.find({});


        const Embed = new MessageEmbed()
            .setTitle('المخزون الموجود')
            .setDescription(`**مرحبا اعضاء السيرفر يمكنكم التحقق من مخزون الاعضاء لدينا من الاسفل \n\n الكمية : ${allAccounts.length}**`)
            .setThumbnail(message.guild.iconURL({ dynamic: true, size: 512 }))
            .setAuthor(message.guild.name, message.guild.iconURL({ dynamic: true, size: 512 }))
            .setColor(لون_الامبيد);

        const row = new MessageActionRow().addComponents(
            new MessageButton()
                .setCustomId('refresh_stock')
                .setLabel('ريفريش')
                .setStyle('SECONDARY'), 

            new MessageButton()
                .setCustomId('all_stock')
                .setDisabled(true)
                .setLabel(`الكمية ${allAccounts.length}`)
                .setStyle('SECONDARY')
        );

        await message.channel.send({ embeds: [Embed], components: [row] });
    }
});

client.on('interactionCreate', async interaction => {
    if (interaction.isButton()) {
        if (interaction.customId === 'refresh_stock') {

            const allAccounts = await Members.find({});
            await interaction.deferReply({ephemeral: true});
            const validAccounts = [];
    
            for (let account of allAccounts) {
                try {
                    const userGuilds = await oauth.getUserGuilds(account.accessToken); 
                    
                    if (userGuilds.length > 100) {
                        await Members.deleteOne({ userId: account.userId });
                        console.log(`تم حذف الحساب ${account.userId} بسبب وجوده في أكثر من 100 سيرفر`);
                        continue;
                    }
            
                    const newAccessToken = await oauth.tokenRequest({
                        grantType: 'refresh_token',
                        refreshToken: account.refreshToken,
                    });
            
                    if (newAccessToken) {
                        await Members.updateOne(
                            { userId: account.userId },
                            {
                                refreshToken: newAccessToken.refresh_token,
                                accessToken: newAccessToken.access_token,
                            }
                        );
                        validAccounts.push(account); 
                    }
                } catch (error) {
                    console.log(`خطأ في الحساب ${account.userId}:`, error);
            
                    await Members.deleteOne({ userId: account.userId });
                    console.log(`تم حذف الحساب ${account.userId} بسبب خلل في التوكن`);
                }
            }
            
    
            const Embed = new MessageEmbed()
                .setTitle('المخزون الموجود')
                .setDescription(`**مرحبا اعضاء السيرفر يمكنكم التحقق من مخزون الاعضاء لدينا من الاسفل \n\n الكمية : ${validAccounts.length}**`)
                .setThumbnail(interaction.guild.iconURL({ dynamic: true, size: 512 }))
                .setAuthor(interaction.guild.name, interaction.guild.iconURL({ dynamic: true, size: 512 }))
                .setColor(لون_الامبيد);

            await interaction.message.edit({ embeds: [Embed] });
            await interaction.editReply({ content: 'تم تحديث الستوك بنجاح', ephemeral: true });
        }
    }
});
