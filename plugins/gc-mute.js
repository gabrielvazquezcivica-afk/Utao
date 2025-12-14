let handler = async (m, { conn, args, isAdmin, usedPrefix, command }) => {

    if (!m.isGroup)
        return conn.sendMessage(m.chat, { text: '❗ Este comando solo funciona en grupos.' }, { quoted: m })

    if (!isAdmin)
        return conn.sendMessage(m.chat, { text: '❗ Solo los admins pueden usar este comando.' }, { quoted: m })

    let target =
        m.mentionedJid?.[0] ||
        (args[0] ? args[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net' : null)

    if (!target)
        return conn.sendMessage(m.chat, {
            text: `✳️ Uso correcto:\n${usedPrefix}${command} @usuario`
        }, { quoted: m })

    global.db.muted ??= {}
    global.db.muted[m.chat] ??= {}

    if (command === 'mute') {
        global.db.muted[m.chat][target] = true
        await conn.sendMessage(m.chat, {
            text: `🔇 Usuario silenciado\n@${target.split('@')[0]}`,
            mentions: [target]
        })
    }

    if (command === 'unmute') {
        delete global.db.muted[m.chat][target]
        await conn.sendMessage(m.chat, {
            text: `🔈 Usuario desilenciado\n@${target.split('@')[0]}`,
            mentions: [target]
        })
    }
}

handler.help = ['mute @tag', 'unmute @tag']
handler.tags = ['group']
handler.command = /^(mute|unmute)$/i

// =======================================================
// 🔥 GATABOT: BORRADO VISUAL REAL (USAR handler.all)
// =======================================================

handler.all = async function (m, { conn, isAdmin }) {
    try {
        if (!m.isGroup) return
        if (m.fromMe) return
        if (!m.message) return

        const chat = m.chat
        const sender = m.sender

        if (!global.db?.muted?.[chat]?.[sender]) return

        // Bot debe ser admin
        if (!isAdmin) return

        // ⛔ BORRADO VISUAL REAL
        await conn.sendMessage(chat, {
            delete: m.key
        })

    } catch (e) {
        console.error('[MUTE DELETE ERROR]', e)
    }
}

export default handler
