let handler = async (m, { conn, args, isAdmin, usedPrefix, command }) => {

    const chat = m.chat

    if (!m.isGroup)
        return conn.sendMessage(chat, { text: '❗ Este comando solo funciona en grupos.' }, { quoted: m })

    if (!isAdmin)
        return conn.sendMessage(chat, { text: '❗ Solo los admins pueden usar este comando.' }, { quoted: m })

    // Obtener usuario objetivo
    let target =
        m.mentionedJid?.[0] ||
        (args[0] ? args[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net' : null)

    if (!target)
        return conn.sendMessage(chat, {
            text: `✳️ Uso correcto:\n${usedPrefix}${command} @usuario`
        }, { quoted: m })

    // Base de datos
    if (!global.db) global.db = {}
    if (!global.db.muted) global.db.muted = {}
    if (!global.db.muted[chat]) global.db.muted[chat] = {}

    // ─── MUTE ───
    if (command === 'mute') {
        global.db.muted[chat][target] = true

        await conn.sendMessage(chat, {
            text: `🔇 *Usuario silenciado*\n@${target.split('@')[0]}`,
            mentions: [target]
        }, { quoted: m })

        await conn.sendMessage(chat, { react: { text: '🔇', key: m.key } })
    }

    // ─── UNMUTE ───
    if (command === 'unmute') {
        delete global.db.muted[chat][target]

        await conn.sendMessage(chat, {
            text: `🔈 *Usuario desilenciado*\n@${target.split('@')[0]}`,
            mentions: [target]
        }, { quoted: m })

        await conn.sendMessage(chat, { react: { text: '🔈', key: m.key } })
    }
}

handler.help = ['mute @tag', 'unmute @tag']
handler.tags = ['group']
handler.command = /^(mute|unmute)$/i

// ============================================================
// 🔥 FILTRO GLOBAL – BORRA MENSAJES DE USUARIOS MUTEADOS
// ============================================================

handler.before = async function (m, { conn }) {
    try {
        if (!m.isGroup) return
        if (m.fromMe) return
        if (!m.message) return

        const chat = m.chat
        const sender = m.sender

        if (!global.db?.muted?.[chat]?.[sender]) return

        // Tipos de mensajes a borrar
        const tipos = [
            'conversation',
            'extendedTextMessage',
            'imageMessage',
            'videoMessage',
            'stickerMessage',
            'audioMessage',
            'documentMessage'
        ]

        const tipo = Object.keys(m.message)[0]
        if (!tipos.includes(tipo)) return

        // 🔥 BORRADO REAL
        await conn.sendMessage(chat, {
            delete: {
                remoteJid: chat,
                fromMe: false,
                id: m.key.id,
                participant: m.key.participant || sender
            }
        })

    } catch (e) {
        console.error('[MUTE ERROR]', e)
    }
}

export default handler
