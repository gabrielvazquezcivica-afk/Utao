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

    // Evitar auto-demote
    if (user === m.sender)
        return conn.reply(m.chat, '❌ *No puedes quitarte admin a ti mismo.*', m);

    const groupMetadata = await conn.groupMetadata(m.chat);

    const target = groupMetadata.participants.find(p => p.id === user);

    // Protección del creador
    if (target?.admin === 'superadmin')
        return conn.reply(
            m.chat,
            '🚫 *No puedes quitarle admin al creador del grupo.*',
            m
        );

    if (!target?.admin)
        return conn.reply(m.chat, '⚠️ *Ese usuario no es admin.*', m);

    await conn.groupParticipantsUpdate(m.chat, [user], 'demote');

    const author = m.sender;

    await conn.reply(
        m.chat,
        `❌ *Admin removido*\n\n👤 *Usuario:* @${user.split("@")[0]}\n🛡️ *Acción realizada por:* @${author.split("@")[0]}`,
        m,
        { mentions: [user, author] }
    );

    await m.react('🧹');

} catch (e) {
    console.log("ERROR GC-DEMOTE:", e);
    return conn.reply(m.chat, '❌ *Ocurrió un error*', m);
}
};

handler.help = ['demote', 'quitaradmin'];
handler.tags = ['group'];
handler.command = ['demote', 'quitaradmin'];

handler.group = true;
handler.admin = true;
handler.botAdmin = true;

export default handler;
