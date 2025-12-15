var handler = async (m, { conn, participants }) => {

  let target = m.mentionedJid?.[0] || m.quoted?.sender
  if (!target)
    return conn.reply(m.chat,'🎄 Debes mencionar a quien Santa sacará',m)

  const groupMetadata = await conn.groupMetadata(m.chat)
  const owner = groupMetadata.owner || m.chat.split('-')[0] + '@s.whatsapp.net'
  const admins = participants.filter(p => p.admin).map(p => p.id)

  if (target === conn.user.jid) return
  if (target === owner) return
  if (admins.includes(target)) return

  await conn.groupParticipantsUpdate(m.chat, [target], 'remove')

  await conn.sendMessage(m.chat,{
    text:`🎄🚫 *Expulsión Navideña*\n@${target.split('@')[0]}`,
    mentions:[target]
  })
}

handler.command = ['kick','ban','sacar','echar']
handler.group = true
handler.admin = true
handler.botAdmin = true

export default handler
