var handler = async (m, { conn, participants, usedPrefix, command }) => {

    if (!m.mentionedJid[0] && !m.quoted) {
        return conn.reply(m.chat, '🚩 *Debes etiquetar o responder el mensaje de la persona que deseas eliminar.*', m);
    }

    let target = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted.sender;
    let who = m.sender; // quien ejecutó el comando

    const groupInfo = await conn.groupMetadata(m.chat);
    const ownerGroup = groupInfo.owner || m.chat.split`-`[0] + '@s.whatsapp.net';
    const ownerBot = global.owner[0][0] + '@s.whatsapp.net';

    // Evitar expulsiones no permitidas
    if (target === conn.user.jid)
        return conn.reply(m.chat, '🚩 No puedo eliminar al bot.', m);

    if (target === ownerGroup)
        return conn.reply(m.chat, '🚩 No puedo eliminar al *propietario del grupo*.', m);

    if (target === ownerBot)
        return conn.reply(m.chat, '🚩 No puedo eliminar al *propietario del bot*.', m);

    // Intento de expulsión
    await conn.groupParticipantsUpdate(m.chat, [target], 'remove');

    // Aviso de expulsión
    let nameTarget = await conn.getName(target);
    let nameWho = await conn.getName(who);

    await conn.sendMessage(m.chat, {
        text:
`🚫 *Usuario expulsado del grupo*

👤 *Expulsado:* @${target.split('@')[0]}
🛠️ *Acción realizada por:* @${who.split('@')[0]}

➥ *${nameTarget}* ha sido removido del grupo.`,
        mentions: [target, who]
    });

};

handler.help = ['kick'];
handler.tags = ['grupo'];
handler.command = ['kick','echar','hechar','sacar','ban'];
handler.admin = true;
handler.group = true;
handler.botAdmin = true;

export default handler;
