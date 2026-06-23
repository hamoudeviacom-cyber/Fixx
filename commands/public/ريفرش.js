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

    if (command === 'refresh') {
        if (!settings.Owners.includes(message.author.id)) return;

        const allAccounts = await Members.find({});
        const validAccounts = [];
        let invalidAccounts = 0;

        const msg = await message.reply({
            content: `جاري التحقق من ${allAccounts.length} عضو ...`
        });

        for (let i = 0; i < allAccounts.length; i++) {
            const account = allAccounts[i];
            try {

        const newAccessToken = await oauth.tokenRequest({
            grantType: 'refresh_token',
            refreshToken: account.refreshToken,
            scope: ["identify", "guilds.join"],
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
                invalidAccounts++;
                console.log(`تم حذف الحساب ${account.userId} بسبب خلل في التوكن`);
            }

            await msg.edit({
                content: `جارٍ التحقق:\n\n✔️ الاعضاء الصالحة: ${validAccounts.length}\n❌ الاعضاء المحذوفة: ${invalidAccounts}\n⏳ الاعضاء المتبقية: ${allAccounts.length - (i + 1)}`
            });
        }

        await msg.edit({
            content: `تمت عملية التحديث بنجاح ✅\n\n✔️ الاعضاء الصالحة: ${validAccounts.length}\n❌ الاعضاء المحذوفة: ${invalidAccounts}`
        });
    }
});
