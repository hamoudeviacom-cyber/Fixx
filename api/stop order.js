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
    if (interaction.customId.startsWith(`Stop_Order_`)) {
        const state = interaction.customId.split('_')[2];
    const data = await ServerSettings.findOne({});
    const order = data.orders.find((e) => e.state === state);
    
    if (!order) return interaction.reply({ content: 'Invalid order ID', ephemeral: true });


        order.join = false;
        await data.save();

        const updatedButtons = new MessageActionRow().addComponents(
            new MessageButton()
                .setCustomId(`Check_Order_${state}`)
                .setLabel('فحص طلبك الحالي')
                .setStyle('SECONDARY'),
            new MessageButton()
                .setCustomId(`Resume_Order_${state}`)
                .setLabel('إكمال الطلب')
                .setStyle('SUCCESS')
        );

        await interaction.update({
            components: [updatedButtons]
        });
    } if (interaction.customId.startsWith(`Resume_Order_`)) {
        const state = interaction.customId.split('_')[2];
    const data = await ServerSettings.findOne({});
    const order = data.orders.find((e) => e.state === state);
    
    if (!order) return interaction.reply({ content: 'Invalid order ID', ephemeral: true });

        order.join = true;
        await data.save();

        const updatedButtons = new MessageActionRow().addComponents(
            new MessageButton()
                .setCustomId(`Check_Order_${state}`)
                .setLabel('فحص طلبك الحالي')
                .setStyle('SECONDARY'),
            new MessageButton()
                .setCustomId(`Stop_Order_${state}`)
                .setLabel('ايقاف الطلب مؤقتا')
                .setStyle('DANGER')
        );

        await interaction.update({
            components: [updatedButtons]
        });
    }
});
