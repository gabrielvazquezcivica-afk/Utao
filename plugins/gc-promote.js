const handler = async (m, { conn, participants, usedPrefix, command }) => {
try {

    // Evita error de undefined.toLowerCase()
    command = (command || "").toLowerCase()

    if (!m.isGroup)
        return conn.reply(m.chat, '❗ *Este comando solo funciona en grupos.*', m)

    // Usuario mencionado o citado
    let user = m.mentionedJid[0]
        ? m.mentionedJid[0]
        : m.quoted
            ? m.quoted.sender
            : false

    if (!user) {
        return conn.reply(m.chat,
            `🚩 *Etiqueta o responde al mensaje del usuario que quieres ${(command === 'promote' ? 'dar admin' : 'quitar admin')}.*`,
            m
        )
    }

    // ❌ ANTI AUTO-ADMIN (NO permitir darse admin a sí mismo)
    if (user === m.sender) {
        return conn.reply(
            m.chat,
            '⛔ *No puedes darte admin a ti mismo.*',
            m
        )
    }

    // Metadata
    const groupMetadata = await conn.groupMetadata(m.chat)
    const groupAdmins = groupMetadata.participants.filter(p => p.admin)
    const isAdmin = groupAdmins.some(a => a.id === user)

    // ───────────────
    //     PROMOTE
    // ───────────────
    if (command === 'promote') {

        if (isAdmin)
            return conn.reply(m.chat, '⚠️ *Ese usuario ya es administrador.*', m)

        await conn.groupParticipantsUpdate(m.chat, [user], 'promote')

        await conn.reply(
            m.chat,
            `🟢 *Administrador otorgado*\n@${user.split('@')[0]} ahora es admin.`,
            m,
            { mentions: [user] }
        )

        await m.react('🎉')
        return
    }

    // ───────────────
    //     DEMOTE
    // ───────────────
    if (command === 'demote') {

        if (!isAdmin)
            return conn.reply(m.chat, '⚠️ *Ese usuario no es administrador.*', m)

        await conn.groupParticipantsUpdate(m.chat, [user], 'demote')

        await conn.reply(
            m.chat,
            `🔻 *Administrador retirado*\n@${user.split('@')[0]} ahora es miembro normal.`,
            m,
            { mentions: [user] }
        )

        await m.react('👍🏻')
        return
    }

} catch (e) {
    console.log('ERROR EN GC-ADMIN.JS =>', e)
    conn.reply(m.chat, '❌ *Ocurrió un error al ejecutar el comando.*', m)
}}

handler.help = ['promote', 'demote']
handler.tags = ['group']
handler.command = ['promote', 'daradmin', 'demote', 'quitaradmin']

handler.group = true
handler.admin = true
handler.botAdmin = true

export default handlerhandler.command = /^promote|demote$/i;

export default handler;
