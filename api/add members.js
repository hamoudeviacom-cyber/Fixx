const { client, app, settings } = require('../../index');
const { Intents, MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');
const OAuth2 = require('discord-oauth2');
const Members = require('../../models/members');
const ServerSettings = require('../../models/settings');
const { default: chalk } = require('chalk');
const path = require('path');
const { لون_الامبيد } = require('../../config/settings');


const oauth = new OAuth2({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  redirectUri: process.env.REDIRECT_URI,
});

app.get('/members/add', async (req, res) => {
    let state = req.query.state;
    let guildId = req.query.guild_id;
  
    try {
      const allMembers = await Members.find({});
      const data = await ServerSettings.findOne({});
  
      const order = data.orders.find((e) => e.state === state);
      if (!order) return res.status(400).send("Invalid order ID");
  
      if (order.status == false) return res.send("Order Is completed");

      const amount = order.amount;
      const typeTokens = order.Type;
      const userBuyer = await client.users.fetch(order.UserBuyer);
      const channel = await client.channels.fetch(order.Channel);
      const guild = await client.guilds.fetch(guildId);
      const membersToAdd = allMembers.slice(0, amount);
      const user = await client.users.fetch(userBuyer);
      let addedCount = 0;
  
      let initialMessage = await channel.send(`جاري إضافة ${amount} عضو. متبقي ${amount} عضو 😎`);
  
      const embed = new MessageEmbed()
        .setColor(لون_الامبيد)
        .setTitle('جاري عملية ادخال الاعضاء الان')
        .setDescription(`**مرحبا ${user} يمكنك التحقق من حالة طلبك من خلال الازرار بالاسفل**`)
        .setAuthor(user.username, user.displayAvatarURL({ dynamic: true }))
        .setThumbnail(user.displayAvatarURL({ dynamic: true }))
        .setFooter(guild.name, guild.iconURL({ dynamic: true }))
        .setTimestamp();
  
      const buttons = new MessageActionRow().addComponents(
        new MessageButton()
          .setCustomId(`Check_Order_${state}`)
          .setLabel('فحص طلبك الحالي')
          .setStyle('SECONDARY'),
        new MessageButton()
          .setCustomId(`Stop_Order_${state}`)
          .setLabel('ايقاف الطلب مؤقتا')
          .setStyle('DANGER'),
      );
  
      await user.send({ embeds: [embed], components: [buttons] });
  
      res.render('order', {
        userBuyer: userBuyer,
        order: order,
        amount: amount,
        guild: { name: guild.name, id: guild.id, memberCount: guild.memberCount, iconURL: guild.iconURL({ dynamic: true }) },
        estimatedMemberCount: guild.memberCount + amount,
      });
  
      order.join = true;
      order.serverId = guildId;
      await data.save();
  
      for (let i = 0; i < membersToAdd.length; i++) {
        const member = membersToAdd[i];
       
        while (!order.join) {
          await new Promise(resolve => setTimeout(resolve, 1000)); //  كل ثانية
          await data.reload(); 
        }
  
        try {
          await oauth.addMember({
            guildId,
            accessToken: member.accessToken,
            userId: member.userId,
            botToken: client.token,
          });
  
          addedCount++;
  
          await initialMessage.edit(`تم إضافة ${addedCount} عضو. متبقي ${amount - addedCount} عضو.`);
  
          order.addedCount = addedCount; // العدد المضاف
          order.remainingCount = amount - addedCount; // العدد المتبقي
          await data.save();
  
          console.log(chalk.green(`Done Add Member: ${member.userId} To ${guildId} Server`));
        } catch (error) {
          console.log(`خطأ في إضافة العضو ${member.userId}:`, error);
        }
      }
      order.status = false
      await data.save();
      await initialMessage.edit(`تم إضافة ${addedCount} عضو بنجاح الي السيرفر ${guildId}`);
      await user.send({ content : `تم انتهاء طلبك بنجاح` });
    } catch (error) {
      console.error("حدث خطأ أثناء معالجة الطلب:", error);
      res.status(500).send("An error occurred while processing the request.");
    }
  });
  