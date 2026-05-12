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
    // พิมพ์คำว่า !setup เพื่อเรียกเมนูปุ่มกด
    if (message.content === '!setup') {
        const embed = new EmbedBuilder()
            .setColor('#FFFFFF')
            .setTitle('ยินดีต้อนรับ สู่˖ ֹ੭୧ 𝐙𝐞𝐫𝐨𝐋𝐞𝐯𝐞𝐥 ⊹ ࣪ ⑅')
            .setDescription('นี่คือ บอทสุ่มห้อง⊹ ࣪ ˖\n- ควรอยู่ห้องด้านล่างก่อน\n- เลือกปุ่มตามใจเรา\n- กดเลย\nบอทจะย้ายเราเข้าเองครับ ขอบคุณคับ')
            .setImage('https://raw.githubusercontent.com/ddpp9199-arch/-/main/1000016742.jpg'); // ใช้รูปที่เธอส่งมา

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

    // ดึงห้องเสียงทั้งหมดในเซิร์ฟเวอร์
    const allVoiceChannels = interaction.guild.channels.cache.filter(c => c.type === 2 && c.id !== voiceChannel?.id);

    try {
        if (interaction.customId === 'move_filled') {
            const filledChannels = allVoiceChannels.filter(c => c.members.size > 0);
            if (filledChannels.size === 0) return interaction.reply({ content: 'ตอนนี้ไม่มีห้องไหนที่มีคนอยู่เลยเธอ!', ephemeral: true });
            const target = filledChannels.random();
            await member.voice.setChannel(target);
            await interaction.reply({ content: `พาเธอไปจอยห้อง **${target.name}** แล้วนะ!`, ephemeral: true });

        } else if (interaction.customId === 'move_empty') {
            const emptyChannels = allVoiceChannels.filter(c => c.members.size === 0);
            if (emptyChannels.size === 0) return interaction.reply({ content: 'ห้องว่างเต็มหมดแล้วอ่ะเธอ!', ephemeral: true });
            const target = emptyChannels.random();
            await member.voice.setChannel(target);
            await interaction.reply({ content: `พาเธอไปพักผ่อนที่ห้อง **${target.name}** แล้วนะ!`, ephemeral: true });

        } else if (interaction.customId === 'disconnect') {
            if (!voiceChannel) return interaction.reply({ content: 'เธอไม่ได้อยู่ในห้องเสียงนะ', ephemeral: true });
            await member.voice.disconnect();
            await interaction.reply({ content: 'เตะเธอออกจากห้องเสียงเรียบร้อย!', ephemeral: true });
        }
    } catch (err) {
        interaction.reply({ content: 'บอทย้ายไม่ได้! เช็กสิทธิ์ Move Members หรือยังเธอ?', ephemeral: true });
    }
});

client.login(process.env.TOKEN);
