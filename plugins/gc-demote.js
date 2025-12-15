const handler = async (m, { conn }) => {
  if (!m.isGroup) return

  let user = m.mentionedJid[0] || m.quoted?.sender
  if (!user || user === m.sender) return

  const metadata = await conn.groupMetadata(m.chat)
  const target = metadata.participants.find(p => p.id === user)

  if (!target?.admin) return
  if (target.admin === 'superadmin') return

  await conn.groupParticipantsUpdate(m.chat, [user], 'demote')
  await m.react('❄️')
}

handler.command = ['demote', 'quitaradmin']
handler.group = true
handler.admin = true
handler.botAdmin = true

export default handler
