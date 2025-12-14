var handler = async (m, { conn, participants }) => {
    // Verificar mención o respuesta
    let target = m.mentionedJid?.[0] || m.quoted?.sender;
    if (!target)
        return conn.reply(m.chat,
            '🚩 *Debes mencionar o responder al mensaje del usuario que deseas expulsar.*',
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
        return conn.reply(m.chat, '🚩 *No puedo expulsarme a mí mismo.*', m);

    if (target === ownerGroup)
        return conn.reply(m.chat, '🚩 *No puedes expulsar al creador del grupo.*', m);

    if (target === ownerBot)
        return conn.reply(m.chat, '🚩 *No puedes expulsar al propietario del bot.*', m);

    if (admins.includes(target))
        return conn.reply(m.chat, '🚩 *No puedes expulsar a un administrador del grupo.*', m);

    // Expulsar
    try {
        await conn.groupParticipantsUpdate(m.chat, [target], 'remove');

        await conn.sendMessage(m.chat, {
            text: `🚫 *Usuario expulsado del grupo*

👤 *Expulsado:* @${target.split('@')[0]}
🛠️ *Acción realizada por:* @${executor.split('@')[0]}`,
            mentions: [target, executor]
        });

    } catch (e) {
        console.error(e);
        conn.reply(m.chat, '❌ *Ocurrió un error al intentar expulsar al usuario.*', m);
    }
};

handler.help = ['kick @tag', 'ban @tag'];
handler.tags = ['grupo'];
handler.command = ['kick', 'echar', 'hechar', 'sacar', 'ban'];
handler.admin = true;
handler.group = true;
handler.botAdmin = true;

export default handler;
