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

client.on('messageCreate', async message => {
    // ใช้คำสั่ง !setup (ถ้าบอทตอบซ้ำ ให้ลองเปลี่ยนเป็นคำอื่นเช่น !start)
    if (message.content === '!setup' && !message.author.bot) {
        const embed = new EmbedBuilder()
            .setColor('#FFFFFF')
            .setTitle('ยินดีต้อนรับ สู่˖ ֹ੭୧ 𝐙𝐞𝐫𝐨𝐋𝐞𝐯𝐞𝐥 ⊹ ࣪ ⑅')
            .setDescription('นี่คือ บอทสุ่มห้อง⊹ ࣪ ˖\n\n• ควรอยู่ห้องด้านล่างก่อน\n• เลือกปุ่มตามใจเรา\n• กดเลย\n\nบอทจะย้ายเราเข้าเองครับ ขอบคุณคับ\n\n↓↓')
            // ใส่ลิงก์รูปที่เธอ Copy มาจาก Discord ตรงๆ ในนี้
            .setImage('https://images-ext-1.discordapp.net/external/vL0_Zg-66yA-K-7WInaETo7h_LhNREpX2V2Z9V7R7_Y/https/raw.githubusercontent.com/ddpp9199-arch/-/main/1000016742.jpg'); 

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
        if (interaction.customId === 'move_filled') {
            const filledChannels = allVoiceChannels.filter(c => c.members.size > 0);
            if (filledChannels.size === 0) return interaction.reply({ content: 'ไม่มีใครอยู่ในห้องอื่นเลยเธอ!', ephemeral: true });
            await member.voice.setChannel(filledChannels.random());
            await interaction.reply({ content: 'ย้ายไปจอยกับคนอื่นแล้วนะ!', ephemeral: true });
        } else if (interaction.customId === 'move_empty') {
            const emptyChannels = allVoiceChannels.filter(c => c.members.size === 0);
            if (emptyChannels.size === 0) return interaction.reply({ content: 'ห้องเต็มหมดแล้ว!', ephemeral: true });
            await member.voice.setChannel(emptyChannels.random());
            await interaction.reply({ content: 'ย้ายไปห้องว่างให้แล้วจ้า!', ephemeral: true });
        } else if (interaction.customId === 'disconnect') {
            if (voiceChannel) await member.voice.disconnect();
            await interaction.reply({ content: 'ออกจากห้องเรียบร้อย!', ephemeral: true });
        }
    } catch (e) { 
        console.error(e);
        interaction.reply({ content: 'บอทไม่มีสิทธิ์ย้ายคนอ่ะเธอ! (ต้องมี Move Members)', ephemeral: true }); 
    }
});

client.login(process.env.TOKEN);
