const handler = async (m, { conn, text, participants }) => {

  // Reacción
  await conn.sendMessage(m.chat, {
    react: { text: "🚨", key: m.key }
  })

  // Usuarios del grupo
  const users = participants.map(u => u.id)

  // Nombre del bot
  const botName = conn.getName(conn.user.jid)

  // Meses con emoji
  const monthNames = [
    'Enero ❄️', 'Febrero ❤️', 'Marzo 🌱', 'Abril 🌧️',
    'Mayo 🌼', 'Junio ☀️', 'Julio 🔥', 'Agosto 🌞',
    'Septiembre 🍂', 'Octubre 🎃', 'Noviembre 🍁', 'Diciembre 🎄'
  ]

  const date = new Date()
  const finalDate = `${date.getDate()} de ${monthNames[date.getMonth()]} de ${date.getFullYear()}`
  const footer = `\n\n> ${botName} — ${finalDate}`

  // Validación
  if (!text && !m.quoted) {
    return conn.reply(
      m.chat,
      '*⚠️ Escribe un mensaje o responde a uno para usar este comando.*',
      m
    )
  }

  // TEXTO NORMAL
  if (text && !m.quoted) {
    return conn.sendMessage(
      m.chat,
      {
        text: text + footer,
        mentions: users
      },
      { quoted: m }
    )
  }

  // RESPONDIENDO A MENSAJE
  if (m.quoted) {
    const q = m.quoted
    const mime = q.mtype
    let msg = {}

    switch (mime) {

      case 'imageMessage':
        msg = {
          image: await q.download(),
          caption: (text || q.text || '') + footer,
          mentions: users
        }
        break

      case 'videoMessage':
        msg = {
          video: await q.download(),
          caption: (text || q.text || '') + footer,
          mentions: users
        }
        break

      case 'audioMessage':
        msg = {
          audio: await q.download(),
          mimetype: 'audio/mp4',
          ptt: false, // ❌ NO PTT
          mentions: users
        }
        break

      case 'stickerMessage':
        msg = {
          sticker: await q.download(),
          mentions: users
        }
        break

      default:
        msg = {
          text: (text || q.text || '') + footer,
          mentions: users
        }
        break
    }

    return conn.sendMessage(m.chat, msg, { quoted: m })
  }
}

handler.help = ['hidetag']
handler.tags = ['group']
handler.command = /^(hidetag|ht|notificar|notify|tag)$/i
handler.group = true
handler.admin = true

export default handler
