const handler = async (m, { conn }) => {
  try {
    if (!m.isGroup) return

    let user = m.mentionedJid[0]
      ? m.mentionedJid[0]
      : m.quoted
        ? m.quoted.sender
        : null

    if (!user) return
    if (user === m.sender) return

    const metadata = await conn.groupMetadata(m.chat)
    const target = metadata.participants.find(p => p.id === user)

    if (!target?.admin) return
    if (target.admin === 'superadmin') return

    await conn.groupParticipantsUpdate(m.chat, [user], 'demote')

    // ❄️ reacción navideña
    await m.react('❄️')

  } catch (e) {
    console.log('DEMOTE ERROR:', e)
  }
}

handler.command = ['demote', 'quitaradmin']
handler.group = true
handler.admin = true
handler.botAdmin = true

export default handler
