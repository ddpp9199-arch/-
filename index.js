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

        // ส่งข้อความตอบกลับ
        const msg = await interaction.reply({ content: responseMessage, fetchReply: true });
        
        // ตั้งเวลาลบข้อความภายใน 20 วินาที (20000 มิลลิวินาที)
        setTimeout(() => {
            interaction.deleteReply().catch(err => console.log("ลบไม่ทัน หรือข้อความหายไปแล้ว"));
        }, 20000);

    } catch (e) { 
        console.error(e);
        interaction.reply({ content: 'บอทไม่มีสิทธิ์ย้ายคนอ่ะเธอ!', ephemeral: true }); 
    }
});
