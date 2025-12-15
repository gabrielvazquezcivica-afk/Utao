var handler = async (m, { conn, args, isAdmin }) => {

if (!isAdmin)
  return m.reply(
    '🎅❌ *Ho ho ho…* Solo los **admins del Polo Norte** pueden repartir el link mágico del grupo 🎄✨'
  )

let group = m.chat
let link = 'https://chat.whatsapp.com/' + await conn.groupInviteCode(group)
conn.reply(
  m.chat,
  '🎄✨ *¡Ho ho ho!* ✨🎄\n\n' +
  '🎁 Aquí tienes el *link mágico del grupo* para compartir esta Navidad:\n\n' +
  link +
  '\n\n❄️ Que la alegría navideña esté con ustedes ❄️',
  m,
  rcanal,
  { detectLink: true }
)

}
handler.help = ['link']
handler.tags = ['grupo']
handler.command = ['link','linkgroup']

handler.group = true
handler.botAdmin = true
handler.admin = true

export default handler
