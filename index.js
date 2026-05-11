const { Client, GatewayIntentBits } = require('discord.js');
const client = new Client({ 
    intents: [
        GatewayIntentBits.Guilds, 
        GatewayIntentBits.GuildMessages, 
        GatewayIntentBits.MessageContent
    ] 
});

client.once('ready', () => {
    console.log('Z-Sora Online! 🎸');
});

client.on('messageCreate', message => {
    if (message.content === 'สวัสดี') {
        message.reply('สวัสดีครับ ผม Z-Sora บอทสุดเท่ของเธอมาแล้ว! 🎸🔥');
    }
});

client.login('MTQ5OTcxNzM1MjY0NjkwMTgyMQ.G7z46Q.TM0--HvI8xjdiroBPuG5hqZcyZHoO_VzFlZtRs');
