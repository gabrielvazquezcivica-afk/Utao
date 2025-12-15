var handler = async (m, { conn, participants, isAdmin }) => {
    if (!isAdmin)
        return conn.reply(
            m.chat,
            '🎅❌ *Ho ho ho…* Solo los **admins del Polo Norte** pueden expulsar duendes del grupo 🎄✨',
            m
        );

    // Verificar mención o respuesta
    let target = m.mentionedJid?.[0] || m.quoted?.sender;
    if (!target)
        return conn.reply(m.chat,
            '🎄🚩 *Ho ho ho~ Debes mencionar o responder al usuario que Santa va a sacar del grupo.*',
            m
        );

    let executor = m.sender;

    // Metadata del grupo
    const groupMetadata = await conn.groupMetadata(m.chat);
    const ownerGroup = groupMetadata.owner || `${m.chat.split('-')[0]}@s.whatsapp.net`;
    const ownerBot = global.owner?.[0]?.[0] + '@s.whatsapp.net';

    // Lista de admins
    const admins = participants
        .filter(p => p.admin)
        .map(p => p.id);

    // Protecciones
    if (target === conn.user.jid)
        return conn.reply(m.chat, '🎅🚩 *No puedo regalarme carbón a mí mismo.*', m);

    if (target === ownerGroup)
        return conn.reply(m.chat, '🎄🚩 *No puedes expulsar al creador del grupo, Santa lo protege.*', m);

    if (target === ownerBot)
        return conn.reply(m.chat, '🎁🚩 *No puedes expulsar al dueño del bot, está en la lista buena.*', m);

    if (admins.includes(target))
        return conn.reply(m.chat, '❄️🚩 *No puedes expulsar a un admin, es un elfo del grupo.*', m);

    // Expulsar
    try {
        await conn.groupParticipantsUpdate(m.chat, [target], 'remove');

        await conn.sendMessage(m.chat, {
            text: `🎄🚫 *Expulsión Navideña*

🎅 *Usuario enviado al Polo Norte:* @${target.split('@')[0]}
🛠️ *Acción realizada por:* @${executor.split('@')[0]}

🎁 *Felices fiestas~*`,
            mentions: [target, executor]
        });

    } catch (e) {
        console.error(e);
        conn.reply(m.chat, '❌🎄 *Hubo un error y Santa no pudo completar la expulsión.*', m);
    }
};

handler.help = ['kick @tag', 'ban @tag'];
handler.tags = ['grupo'];
handler.command = ['kick', 'echar', 'hechar', 'sacar', 'ban'];
handler.admin = true;
handler.group = true;
handler.botAdmin = true;

export default handler;
