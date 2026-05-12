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
    if (message.content === '!setup') {
        const embed = new EmbedBuilder()
            .setColor('#fdfdfd')
            .setTitle('ยินดีต้อนรับ สู่˖ ֹ੭୧ 𝐙𝐞𝐫𝐨𝐋𝐞𝐯𝐞𝐥 ⊹ ࣪ ⑅')
            .setDescription('นี่คือ บอทสุ่มห้อง⊹ ࣪ ˖\n\n• ควรอยู่ห้องด้านล่างก่อน\n• เลือกปุ่มตามใจเรา\n• กดเลย\n\nบอทจะย้ายเราเข้าเองครับ ขอบคุณคับ\n\n↓↓') // เพิ่มลูกศรให้แล้ว
            .setImage('https://cdn.discordapp.com/attachments/1114524458319695954/1239148443912110110/1000016742.jpg'); // แก้ลิงก์รูปให้ใหม่

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder().setCustomId('move_filled').setLabel('ย้ายไปหาห้องที่มีคน').setStyle(ButtonStyle.Success),
                new ButtonBuilder().setCustomId('move_empty').setLabel('ย้ายมาห้องที่ไม่มีคน').setStyle(ButtonStyle.Primary),
                new ButtonBuilder().setCustomId('disconnect').setLabel('ออกจากห้อง').setStyle(ButtonStyle.Danger),
            );

        await message.channel.send({ embeds: [embed], components: [row] });
    }
});

// ส่วน Interaction (ย้ายคน) ใช้ของเดิมได้เลยครับ หรือวางทับทั้งหมดไปเลย
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
            if (filledChannels.size === 0) return interaction.reply({ content: 'ไม่มีห้องที่มีคนเลยเธอ!', ephemeral: true });
            await member.voice.setChannel(filledChannels.random());
            await interaction.reply({ content: 'ย้ายไปจอยกับเพื่อนแล้วจ้า!', ephemeral: true });
        } else if (interaction.customId === 'move_empty') {
            const emptyChannels = allVoiceChannels.filter(c => c.members.size === 0);
            if (emptyChannels.size === 0) return interaction.reply({ content: 'ห้องเต็มหมดแล้ว!', ephemeral: true });
            await member.voice.setChannel(emptyChannels.random());
            await interaction.reply({ content: 'ย้ายไปห้องส่วนตัวให้แล้วนะ!', ephemeral: true });
        } else if (interaction.customId === 'disconnect') {
            if (voiceChannel) await member.voice.disconnect();
            await interaction.reply({ content: 'ออกห้องเรียบร้อย!', ephemeral: true });
        }
    } catch (e) { interaction.reply({ content: 'บอทไม่มีสิทธิ์ย้ายคนอ่ะเธอ!', ephemeral: true }); }
});

client.login(process.env.TOKEN);
