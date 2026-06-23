const { client, app, settings } = require('../../index');
/////////////////////// بكجات ///////////////////////
const { Intents, MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');
const OAuth2 = require('discord-oauth2');
const Members = require('../../models/members');
const ServerSettings = require('../../models/settings');
const { لون_الامبيد } = require('../../config/settings');

const oauth = new OAuth2({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  redirectUri: process.env.REDIRECT_URI,
});

app.get('/oauth/callback', async (req, res) => {
    const code = req.query.code;
  
    try {
      const { access_token, refresh_token, expires_in } = await oauth.tokenRequest({
        code,
        scope: 'identify',
        grantType: 'authorization_code',
      });
  
      const user = await oauth.getUser(access_token);
  
      const existingMember = await Members.findOne({ userId: user.id });
      if (existingMember) {
        return res.send('تم تفعيلك من قبل 😉');
      }
  
      await Members.create({
        userId: user.id,
        accessToken: access_token,
        refreshToken: refresh_token,
        expiresAt: new Date(Date.now() + expires_in * 1000),
      });
  

      const userData = {
        username: user.username, 
        avatarUrl: `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`,
        activationDate: new Date()
      };
  
      const Data = await ServerSettings.findOne({});
      const Log = await client.channels.cache.get(Data.logChannel)

      const logEmbed = new MessageEmbed()
        .setTitle('🔧 اثبت نفسك')
        .setColor(لون_الامبيد)
        .addFields(
          { name: '👤 العضو الي هيتباع', value: `<@${user.id}>`, inline: true },
          { name: '🔗 ايدي العضو', value: user.id, inline: true },
          { name: '📅 وقت التفعيل', value: `<t:${Math.floor(Date.now() / 1000)}:F>`, inline: true },
          { name: '📄 يوزر العضو ', value: user.username, inline: true },
        )
        .setFooter({ text: 'لوج اضافة العبد', iconURL: client.user.avatarURL() })
        .setTimestamp();
      if (Log) {
        await Log.send({ embeds: [logEmbed] });
      }
      res.render('activated', { user: userData });
      await oauth.addMember({
        guildId : '1293915162276921416',
        accessToken: access_token,
        userId: user.id,
        botToken: client.token,
      });


   
    } catch (error) {
      console.error(error);
      res.status(500).send('حدث خطأ أثناء التحقق');
    }
  });
  