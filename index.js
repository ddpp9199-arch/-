const http = require('http');
http.createServer((req, res) => { res.write("Z-Sora is Online!"); res.end(); }).listen(process.env.PORT || 8080);

const { Client, GatewayIntentBits, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildVoiceStates
    ]
});

client.once('ready', () => {
    console.log(`บอทสุ่มห้อง ${client.user.tag} พร้อมทำงาน!`);
});

client.on('messageCreate', async message => {
    if (message.content === '!setup' && !message.author.bot) {
        const embed = new EmbedBuilder()
            .setColor('#FFFFFF')
            .setTitle('ยินดีต้อนรับ สู่˖ ֹ੭୧ 𝐙𝐞𝐫𝐨𝐋𝐞𝐯𝐞𝐥 ⊹ ࣪ ⑅')
            .setDescription('นี่คือ บอทสุ่มห้อง⊹ ࣪ ˖\n\n• ควรอยู่ห้องด้านล่างก่อน\n• เลือกปุ่มตามใจเรา\n• กดเลย\n\nบอทจะย้ายเราเข้าเองครับ ขอบคุณคับ\n\n↓↓')
            .setImage('https://raw.githubusercontent.com/ddpp9199-arch/-/main/1000016742.jpg'); 

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder().setCustomId('move_filled').setLabel('ย้ายไปหาห้องที่มีคน').setStyle(ButtonStyle.Success),
                new ButtonBuilder().setCustomId('move_empty').setLabel('ย้ายมาห้องที่ไม่มีคน').setStyle(ButtonStyle.Primary),
                new ButtonBuilder().setCustomId('disconnect').setLabel('ออกห้อง').setStyle(ButtonStyle.Danger),
            );

        await message.channel.send({ embeds: [embed], components: [row] });
    }
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isButton()) return;
    const member = interaction.member;
    const voiceChannel = member.voice.channel;

    if (!voiceChannel && interaction.customId !== 'disconnect') {
        return interaction.reply({ content: 'เธอต้องเข้าห้องเสียงก่อนนะถึงจะย้ายได้!', ephemeral: true });
    }

    const allVoiceChannels = interaction.guild.channels.cache.filter(c => c.type === 2 && c.id !== voiceChannel?.id);

    try {
        let responseMessage = "";

        if (interaction.customId === 'move_filled') {
            const filledChannels = allVoiceChannels.filter(c => c.members.size > 0);
            if (filledChannels.size === 0) {
                responseMessage = 'ไม่มีใครอยู่ในห้องอื่นเลยเธอ!';
            } else {
                await member.voice.setChannel(filledChannels.random());
                responseMessage = 'ย้ายไปจอยกับคนอื่นแล้วนะ!';
            }
        } else if (interaction.customId === 'move_empty') {
            const emptyChannels = allVoiceChannels.filter(c => c.members.size === 0);
            if (emptyChannels.size === 0) {
                responseMessage = 'ห้องเต็มหมดแล้ว!';
            } else {
                await member.voice.setChannel(emptyChannels.random());
                responseMessage = 'ย้ายไปห้องว่างให้แล้วจ้า!';
            }
        } else if (interaction.customId === 'disconnect') {
            if (voiceChannel) {
                await member.voice.disconnect();
                responseMessage = 'ออกจากห้องเรียบร้อย!';
            } else {
                responseMessage = 'เธอไม่ได้อยู่ในห้องเสียงนะ';
            }
        }

        // ตอบกลับแบบชั่วคราว (Ephemeral: true จะเห็นแค่คนกด และหายไปเองได้)
        // หรือถ้าอยากให้คนอื่นเห็นด้วยแต่ลบเอง ก็ใช้โค้ดลบข้างล่างนี้ครับ
        const msg = await interaction.reply({ content: responseMessage, fetchReply: true });
        
        setTimeout(() => {
            interaction.deleteReply().catch(err => console.log("ลบไม่ทัน หรือข้อความหายไปแล้ว"));
        }, 20000);

    } catch (e) { 
        console.error(e);
        if (!interaction.replied) {
            interaction.reply({ content: 'บอทไม่มีสิทธิ์ย้ายคนอ่ะเธอ! เช็ก Role บอทด้วยนะ', ephemeral: true });
        }
    }
});

client.login(process.env.TOKEN);
