module.exports = (client, chalk) => {
  client.on('ready', async () => {
      console.log(`Logged in as ${client.user.tag}!`);
      
      let currentActivity = 0;
      const memberCount = client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0);

      const activities = [
          { name: `اقوى شوب عربي | ${client.guilds.cache.size} سيرفر | ${memberCount} مستخدم` },
          { name: `اقوى تشهير علي نطاق واسع ` },
          { name: `${client.guilds.cache.size} سيرفر | ${memberCount} مستخدم` },
          { name: `/مساعدة` },
          { name: `اختيارك الامثل هو Viona | ${client.guilds.cache.size} سيرفر | ${memberCount} مستخدم` },
      ];
    
      updateActivity();
    
      setInterval(updateActivity, 5000);
    
      function updateActivity() {
          client.user.setActivity(activities[currentActivity].name, { type: activities[currentActivity].type });
          currentActivity = (currentActivity + 1) % activities.length;
      }
  });
}
