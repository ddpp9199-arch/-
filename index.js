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
    // 1. คำสั่งทดสอบ
    if (message.content === 'ping') {
        message.reply('pong');
    }

    // 2. คำสั่งสวัสดี (แบบตอบคำเดียว)
    if (message.content === 'สวัสดี') {
        message.reply('สวัสดีครับเจ้าของ! ผม Z-Sora ออนไลน์พร้อมรับใช้แล้วครับ 🎸🔥');
    }

    // 3. ระบบสุ่มทักทาย (พิมพ์คำว่า ทักทาย)
    if (message.content === 'ทักทาย') {
        const answers = [
            'โย่! ว่าไงเธอ วันนี้กินข้าวหรือยัง?',
            'สวัสดีครับ Z-Sora พร้อมประจำการ!',
            'ฮัลโหลลล มีอะไรให้ช่วยไหมครับ?',
            'ดีครับเจ้าของ วันนี้ขอให้เป็นวันที่ดีนะ!'
        ];
        const randomAnswer = answers[Math.floor(Math.random() * answers.length)];
        message.reply(randomAnswer);
    }

    // 4. ระบบสุ่มอาหาร (พิมพ์คำว่า กินไรดี)
    if (message.content === 'กินไรดี') {
        const foods = ['กะเพราไข่ดาว', 'ก๋วยเตี๋ยวเรือ', 'ส้มตำไก่ย่าง', 'ชาบูไปเลย!', 'ข้าวผัดง่ายๆ'];
        const randomFood = foods[Math.floor(Math.random() * foods.length)];
        message.reply(`Z-Sora ขอแนะนำให้เธอไปกิน... **${randomFood}** ครับ!`);
    }
});

client.login(process.env.TOKEN);
