const handler = async (m, { conn, participants, usedPrefix, command }) => {
try {

    // Asegura que command exista
    command = (command || "").toLowerCase();

    if (!m.isGroup)
        return conn.reply(m.chat, '❗ *Este comando solo funciona en grupos.*', m);

    // Usuario objetivo
    let user = m.mentionedJid[0]
            ? m.mentionedJid[0]
            : m.quoted
                ? m.quoted.sender
                : null;

    if (!user)
        return conn.reply(m.chat, `🚩 *Etiqueta o responde a un usuario.*\n\nEjemplo:\n${usedPrefix + command} @usuario`, m);

    // Anti-auto-admin
    if (user === m.sender)
        return conn.reply(m.chat, `❌ *No puedes ${command === 'promote' ? 'promoverte' : 'quitarte'} a ti mismo.*`, m);

    const groupMetadata = await conn.groupMetadata(m.chat);
    const admins = groupMetadata.participants.filter(p => p.admin);
    const isUserAdmin = admins.some(a => a.id === user);

    if (command === 'promote') {
        if (isUserAdmin)
            return conn.reply(m.chat, '⚠️ *Ese usuario ya es admin.*', m);

        await conn.groupParticipantsUpdate(m.chat, [user], 'promote');
        await conn.reply(m.chat, `✅ *Usuario promovido a admin*\n@${user.split("@")[0]}`, m, { mentions: [user] });
        await m.react('🎉');
    }

    if (command === 'demote') {
        if (!isUserAdmin)
            return conn.reply(m.chat, '⚠️ *Ese usuario no es admin.*', m);

        await conn.groupParticipantsUpdate(m.chat, [user], 'demote');
        await conn.reply(m.chat, `🟥 *Usuario degradado*\n@${user.split("@")[0]}`, m, { mentions: [user] });
        await m.react('📉');
    }

} catch (e) {
    console.log("ERROR GC-ADMIN:", e);
    return conn.reply(m.chat, '❌ *Ocurrió un error*', m);
}
};

handler.help = ['promote', 'demote'];
handler.tags = ['group'];
handler.command = ['promote', 'demote'];

// Requisitos
handler.group = true;
handler.admin = true;
handler.botAdmin = true;

export default handler;
