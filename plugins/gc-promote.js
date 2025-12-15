const handler = async (m, { conn }) => {
  if (!m.isGroup) return

  let user = m.mentionedJid[0] || m.quoted?.sender
  if (!user || user === m.sender) return

  const metadata = await conn.groupMetadata(m.chat)
  const isAdmin = metadata.participants.some(p => p.id === user && p.admin)
  if (isAdmin) return

  await conn.groupParticipantsUpdate(m.chat, [user], 'promote')
  await m.react('🎄')
}

handler.command = ['promote', 'daradmin']
handler.group = true
handler.admin = true
handler.botAdmin = true

export default handler
