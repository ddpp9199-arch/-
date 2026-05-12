const http = require('http');
// สร้าง Server หลอกๆ เพื่อให้ Render เลิกบ่นเรื่อง Port
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
    if (message.content === 'ping') {
        message.reply('pong');
    }
});

client.login(process.env.TOKEN);
