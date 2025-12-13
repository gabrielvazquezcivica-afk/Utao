let handler = async (m, { conn, args, isAdmin, isGroup }) => {

    // Solo grupos
    if (!m.isGroup)
        return conn.reply(m.chat, '❌ Este comando solo funciona en grupos', m)

    // Solo admins
    if (!isAdmin)
        return conn.reply(m.chat, '🚫 Solo los administradores pueden usar este comando', m)

    // Reacción al mensaje del ejecutor
    await conn.sendMessage(m.chat, {
        react: {
            text: '📢',
            key: m.key
        }
    })

    // Metadata del grupo
    const metadata = await conn.groupMetadata(m.chat)
    const groupName = metadata.subject
    const participants = metadata.participants

    // Obtener admins
    const admins = participants
        .filter(p => p.admin)
        .map(p => p.id)

    if (!admins.length)
        return conn.reply(m.chat, '❌ No hay administradores en este grupo', m)

    // Mensaje personalizado
    const textUser = args.join(' ') || 'Se requiere su atención ⚠️'

    // Texto de menciones
    const mentionsText = admins.map(a => `@${a.split('@')[0]}`).join(' ')

    // Foto del grupo
    let pp
    try {
        pp = await conn.profilePictureUrl(m.chat, 'image')
    } catch {
        pp = 'https://i.imgur.com/7D7I6dI.png'
    }

    // Mensaje final
    const caption = `
📢 *LLAMADO A ADMINS*
👥 *Grupo:* ${groupName}

💬 *Mensaje:*
${textUser}

👑 *Administradores:*
${mentionsText}
`.trim()

    // Enviar mensaje
    await conn.sendMessage(m.chat, {
        image: { url: pp },
        caption,
        mentions: admins
    }, { quoted: m })
}

handler.help = ['admins <mensaje>']
handler.tags = ['group']
handler.command = /^admins$/i
handler.group = true
handler.admin = true

export default handler
