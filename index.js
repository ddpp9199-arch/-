const http = require('http');
http.createServer((req, res) => {
   res.write("Z-Sora is Online!");
   res.end();
}).listen(process.env.PORT || 8080);

const { Client, GatewayIntentBits } = require('discord.js');
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

client.once('ready', () => {
    console.log(`เข้าสู่ระบบโดยใช้ชื่อผู้ใช้ ${client.user.tag}!`);
});

client.on('messageCreate', message => {
    // 1. คำสั่งทดสอบระบบ
    if (message.content === 'ping') {
        message.reply('pong');
    }

    // 2. คำสั่งสวัสดี
    if (message.content === 'สวัสดี') {
        message.reply('สวัสดีครับเจ้าของ! ผม Z-Sora ออนไลน์พร้อมรับใช้แล้วครับ 🎸🔥');
    }
});

client.login(process.env.TOKEN);
