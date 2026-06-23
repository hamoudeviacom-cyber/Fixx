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

    if (command === 'join') {
        if (!settings.Owners.includes(message.author.id)) return;

        const serverId = args[0];
        const count = parseInt(args[1]);

        if (!serverId) {
            message.reply('يرجى وضع ايدي السيرفر');
            return;
        }

        if (!count || isNaN(count)) {
            message.reply('يرجى وضع عدد الاعضاء');
            return;
        }

        const guild = client.guilds.cache.get(serverId);
        if (!guild) {
            const button = new MessageActionRow().addComponents(
                new MessageButton()
                    .setURL(`https://discord.com/oauth2/authorize?client_id=${client.user.id}&permissions=1&scope=bot&guild_id=${serverId}`)
                    .setLabel('اضافة البوت')
                    .setStyle('LINK')
            );
            return await message.reply({ content: 'يرجي ادخال البوت أولا من الزر ', components: [button] });
        }

        const allMembers = await Members.find({});
        const serverMembers = await guild.members.fetch();

        const membersToAdd = allMembers.filter(member => !serverMembers.has(member.userId));

        if (membersToAdd.length < count) {
            message.reply(`يمكنك فقط ادخال ${membersToAdd.length} عضو 😀`);
            return;
        }

        let addedCount = 0;
        const initialMessage = await message.reply(`جاري إضافة ${count} عضو...`);

        for (let i = 0; i < count; i++) {
            const member = membersToAdd[i];
            try {
                await oauth.addMember({
                    guildId: serverId,
                    accessToken: member.accessToken,
                    userId: member.userId,
                    botToken: client.token,
                });

                addedCount++;
                console.log(`تم إضافة العضو ${member.userId} إلى السيرفر بنجاح`);

                await initialMessage.edit(`تم إضافة ${addedCount} عضو متبقي ${count - addedCount} عضو`);
            } catch (error) {
                console.log(`خطأ في إضافة العضو ${member.userId}:`, error);
            }
        }

        await initialMessage.edit(`تمت إضافة ${addedCount} عضو إلى السيرفر بنجاح`);
    }
});
