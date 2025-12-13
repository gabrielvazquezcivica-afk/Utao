let handler = async (m, { conn, args, isAdmin, usedPrefix, command }) => {
    if (!m.isGroup)
        return conn.sendMessage(m.chat, { text: '❗ Solo funciona en grupos.' })

    if (!isAdmin)
        return conn.sendMessage(m.chat, { text: '❗ Solo admins pueden usar este comando.' })

    let target =
        m.mentionedJid?.[0] ||
        (args[0] ? args[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net' : null)

    if (!target)
        return conn.sendMessage(m.chat, {
            text: `Usa: ${usedPrefix}${command} @usuario`,
            quoted: m
        })

    global.db = global.db || {}
    global.db.muted = global.db.muted || {}
    global.db.muted[m.chat] = global.db.muted[m.chat] || {}

    if (command === 'mute') {
        global.db.muted[m.chat][target] = true

        await conn.sendMessage(m.chat, {
            text: `🔇 *Usuario silenciado*\n@${target.split('@')[0]}`,
            mentions: [target]
        })

        await conn.sendMessage(m.chat, { react: { text: '🔇', key: m.key } })
    }

    if (command === 'unmute') {
        delete global.db.muted[m.chat][target]

        await conn.sendMessage(m.chat, {
            text: `🔈 *Usuario desilenciado*\n@${target.split('@')[0]}`,
            mentions: [target]
        })

        await conn.sendMessage(m.chat, { react: { text: '🔈', key: m.key } })
    }
}

handler.help = ['mute @tag', 'unmute @tag']
handler.tags = ['group']
handler.command = /^(mute|unmute)$/i

export default handler
