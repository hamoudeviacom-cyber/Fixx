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

client.on('interactionCreate', async interaction => {
    if (!interaction.isButton()) return;
    if (interaction.customId === 'check_server') {

       const modal = new Modal()
       .setCustomId('check_server')
       .setTitle('فحص السيرفر')

      const row =  new TextInputComponent()
        .setCustomId('server_id')
        .setLabel('ادخل السيرفر')
        .setStyle('SHORT')



       const actionRow = new MessageActionRow().addComponents(row);
       modal.addComponents(actionRow);
       await interaction.showModal(modal);

}
})


client.on('interactionCreate', async interaction => {
    if (!interaction.isModalSubmit()) return;
    
    if (interaction.customId === 'check_server') {
        const server_id = interaction.fields.getTextInputValue('server_id');
        const server = client.guilds.cache.get(server_id);
        const Data = await ServerSettings.findOne({});
        
        await interaction.reply({ content: `جاري فحص السيرفر`, ephemeral: true });

        if (!server) {
            const button = new MessageActionRow().addComponents(
                new MessageButton()
                    .setURL(`https://discord.com/oauth2/authorize?client_id=${client.user.id}&permissions=1&scope=bot&guild_id=${server_id}`)
                    .setLabel('اضافة البوت')
                    .setStyle('LINK')
            );
            return await interaction.editReply({ content: 'يرجي ادخال البوت أولا من الزر', components: [button] });
        }

        const allMembers = await Members.find({});
        const serverMembers = await server.members.fetch();
        

        const membersToAdd = allMembers.filter(member => !serverMembers.has(member.userId));
        const membersAvailable = membersToAdd.length;
        const stockAvailable = allMembers.length; 
        
        await interaction.editReply({
            content: `**تم فحص السيرفر بنجاح**\n\nServer Name : ${server.name} \nServer Id : ${server.id}\n`
                    + `✅ **عدد الأعضاء المتاحين للإضافة**: ${membersAvailable}\n`
                    + `📦 **عدد الأعضاء في المخزون**: ${stockAvailable}`
        });
    }
});
