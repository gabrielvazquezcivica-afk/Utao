let handler = async (m, { conn, usedPrefix, command, isAdmin }) => {

if (!isAdmin)
  return conn.reply(
    m.chat,
    '🎅❌ *Ho ho ho…* Solo los **admins del Polo Norte** pueden borrar mensajes traviesos 🎄✨',
    m,
    rcanal
  )

if (!m.quoted)
  return conn.reply(
    m.chat,
    '🎄🚩 *Responde al mensaje que Santa debe desaparecer.*',
    m,
    rcanal
  )

try {
  let delet = m.message.extendedTextMessage.contextInfo.participant
  let bang = m.message.extendedTextMessage.contextInfo.stanzaId
  return conn.sendMessage(m.chat, {
    delete: {
      remoteJid: m.chat,
      fromMe: false,
      id: bang,
      participant: delet
    }
  })
} catch {
  return conn.sendMessage(m.chat, { delete: m.quoted.vM.key })
}}

handler.help = ['delete']
handler.tags = ['grupo']
handler.command = ['del','delete']
handler.group = false
handler.admin = true
handler.botAdmin = true

export default handler
