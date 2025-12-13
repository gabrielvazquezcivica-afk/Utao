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
            `🚩 *Etiqueta o responde a un usuario.*\n\nEjemplo:\n${usedPrefix}demote @usuario`,
            m
        );

    // Anti auto-demote
    if (user === m.sender)
        return conn.reply(m.chat, '❌ *No puedes quitarte admin a ti mismo.*', m);

    const groupMetadata = await conn.groupMetadata(m.chat);
    const admins = groupMetadata.participants.filter(p => p.admin);
    const isUserAdmin = admins.some(a => a.id === user);

    if (!isUserAdmin)
        return conn.reply(m.chat, '⚠️ *Ese usuario no es admin.*', m);

    await conn.groupParticipantsUpdate(m.chat, [user], 'demote');
    await conn.reply(
        m.chat,
        `🟥 *Usuario degradado*\n@${user.split("@")[0]}`,
        m,
        { mentions: [user] }
    );
    await m.react('📉');

} catch (e) {
    console.log("ERROR GC-DEMOTE:", e);
    return conn.reply(m.chat, '❌ *Ocurrió un error*', m);
}
};

handler.help = ['demote'];
handler.tags = ['group'];
handler.command = ['demote'];

// Requisitos
handler.group = true;
handler.admin = true;
handler.botAdmin = true;

export default handler;
