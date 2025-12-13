const handler = async (m, { conn, participants, usedPrefix, command }) => {
try {

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
        return conn.reply(
            m.chat,
            `🚩 *Etiqueta o responde a un usuario.*\n\nEjemplo:\n${usedPrefix}${command} @usuario`,
            m
        );

    // Anti auto-admin
    if (user === m.sender)
        return conn.reply(m.chat, '❌ *No puedes promoverte a ti mismo.*', m);

    const groupMetadata = await conn.groupMetadata(m.chat);
    const admins = groupMetadata.participants.filter(p => p.admin);
    const isUserAdmin = admins.some(a => a.id === user);

    if (isUserAdmin)
        return conn.reply(m.chat, '⚠️ *Ese usuario ya es admin.*', m);

    await conn.groupParticipantsUpdate(m.chat, [user], 'promote');

    const author = m.sender;

    await conn.reply(
        m.chat,
        `✅ *Usuario promovido a admin*\n\n👤 *Usuario:* @${user.split("@")[0]}\n🛡️ *Acción realizada por:* @${author.split("@")[0]}`,
        m,
        { mentions: [user, author] }
    );

    await m.react('🎉');

} catch (e) {
    console.log("ERROR GC-PROMOTE:", e);
    return conn.reply(m.chat, '❌ *Ocurrió un error*', m);
}
};

handler.help = ['promote', 'daradmin'];
handler.tags = ['group'];
handler.command = ['promote', 'daradmin']; // ← alias aquí

// Requisitos
handler.group = true;
handler.admin = true;
handler.botAdmin = true;

export default handler;
