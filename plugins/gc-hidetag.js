let queue = []
let processing = false

async function processQueue(conn) {
  if (processing || queue.length === 0) return
  processing = true

  const { m, text, participants } = queue.shift()

  try {
    // Reacción 🚨
    await conn.sendMessage(m.chat, { react: { text: "🚨", key: m.key } })

    const users = participants.map(u => u.id)

    const botName = conn.getName(conn.user.jid)

    const monthNames = [
      'Enero ❄️', 'Febrero ❤️', 'Marzo 🌱', 'Abril 🌧️',
      'Mayo 🌼', 'Junio ☀️', 'Julio 🔥', 'Agosto 🌞',
      'Septiembre 🍂', 'Octubre 🎃', 'Noviembre 🍁', 'Diciembre 🎄'
    ]

    const date = new Date()
    const finalDate = `${date.getDate()} de ${monthNames[date.getMonth()]} de ${date.getFullYear()}`
    const footer = `\n\n> ${botName} — ${finalDate}`

    // ⚠️ Validación
    if (!text && !m.quoted) {
      await conn.reply(
        m.chat,
        '*⚠️ Debes escribir un mensaje o responder a uno para usar este comando.*',
        m
      )
      processing = false
      return processQueue(conn)
    }

    // 🧩 dividir mentions en bloques seguros
    const chunkSize = 30
    const chunks = []
    for (let i = 0; i < users.length; i += chunkSize) {
      chunks.push(users.slice(i, i + chunkSize))
    }

    // 📤 envío secuencial
    for (const chunk of chunks) {

      let msg = {}

      if (text && !m.quoted) {
        msg = {
          text: text + footer,
          mentions: chunk
        }
      }

      if (m.quoted) {
        const q = m.quoted
        const mime = q.mtype

        switch (mime) {
          case 'audioMessage':
            msg = {
              audio: await q.download(),
              ptt: q.ptt || false,
              mimetype: 'audio/mp4',
              mentions: chunk
            }
            break

          case 'imageMessage':
            msg = {
              image: await q.download(),
              caption: (q.text || text || '') + footer,
              mentions: chunk
            }
            break

          case 'videoMessage':
            msg = {
              video: await q.download(),
              caption: (q.text || text || '') + footer,
              mentions: chunk
            }
            break

          case 'stickerMessage':
            msg = {
              sticker: await q.download(),
              mentions: chunk
            }
            break

          default:
            msg = {
              text: (q.text || text || '') + footer,
              mentions: chunk
            }
        }
      }

      await conn.sendMessage(m.chat, msg, { quoted: m })

      // 🐢 delay invisible (anti 429)
      await new Promise(r => setTimeout(r, 1800))
    }

  } catch (e) {
    console.error('HIDETAG ERROR:', e)
  }

  processing = false
  processQueue(conn)
}

const handler = async (m, { conn, text, participants }) => {
  if (!participants || participants.length < 2) return

  // ➕ se agrega en orden
  queue.push({ m, text, participants })

  processQueue(conn)
}

handler.help = ['hidetag']
handler.tags = ['group']
handler.command = /^(hidetag|ht|n)$/i
handler.group = true
handler.admin = true

export default handler
