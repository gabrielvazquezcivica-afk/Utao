let handler = async (m, { conn, args, isAdmin, usedPrefix, command }) => {
    const chat = m.chat

    if (!m.isGroup)
        return conn.sendMessage(chat, { text: '❗ Solo funciona en grupos.' })

    if (!isAdmin)
        return conn.sendMessage(chat, { text: '❗ Solo admins pueden usar este comando.' })

    let target =
        m.mentionedJid?.[0] ||
        (args[0] ? args[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net' : null)

    if (!target)
        return conn.sendMessage(chat, {
            text: `Usa: ${usedPrefix}${command} @usuario`,
            quoted: m
        })

    // Base de datos
    global.db = global.db || {}
    global.db.muted = global.db.muted || {}
    global.db.muted[chat] = global.db.muted[chat] || {}

    // ===== MUTE =====
    if (command === 'mute') {
        global.db.muted[chat][target] = true

        await conn.sendMessage(chat, {
            text: `🔇 *Usuario silenciado*\n@${target.split('@')[0]}`,
            mentions: [target]
        })

        await conn.sendMessage(chat, { react: { text: '🔇', key: m.key } })
    }

    // ===== UNMUTE =====
    if (command === 'unmute') {
        delete global.db.muted[chat][target]

        await conn.sendMessage(chat, {
            text: `🔈 *Usuario desilenciado*\n@${target.split('@')[0]}`,
            mentions: [target]
        })

        await conn.sendMessage(chat, { react: { text: '🔈', key: m.key } })
    }
}

handler.help = ['mute @tag', 'unmute @tag']
handler.tags = ['group']
handler.command = /^(mute|unmute)$/i

// ============================================================
// 🔥 FILTRO GLOBAL: BORRA TODO MENSAJE DEL USUARIO MUTEADO
// ============================================================

handler.before = async function (m, { conn, isAdmin, isOwner }) {
    try {
        if (!m.isGroup) return
        if (m.fromMe) return

        const chat = m.chat
        const sender = m.sender

        if (!global.db?.muted?.[chat]?.[sender]) return

        // Admins y owner no se silencian
        if (isAdmin || isOwner) return

        // Evitar errores
        if (!m.key?.id) return

        await conn.sendMessage(chat, {
            delete: {
                remoteJid: chat,
                fromMe: false,
                id: m.key.id,
                participant: sender
            }
        })

    } catch (err) {
        console.error('[MUTE ERROR]', err)
    }
}

export default handler
