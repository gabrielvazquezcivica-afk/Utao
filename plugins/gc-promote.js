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
    const isAdmin = metadata.participants
      .some(p => p.id === user && p.admin)

    if (isAdmin) return

    await conn.groupParticipantsUpdate(m.chat, [user], 'promote')

    // 🎄 reacción navideña
    await m.react('🎄')

  } catch (e) {
    console.log('PROMOTE ERROR:', e)
  }
}

handler.command = ['promote', 'daradmin']
handler.group = true
handler.admin = true
handler.botAdmin = true

export default handler
