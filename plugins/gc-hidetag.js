let queue = []
let processing = false

async function wait(ms) {
  return new Promise(r => setTimeout(r, ms))
}

async function processQueue(conn) {
  if (processing || queue.length === 0) return
  processing = true

  const { m, text, participants } = queue.shift()

  try {
    const users = participants.map(u => u.id)

    const botName = conn.getName(conn.user.jid)

    const monthNames = [
      'Enero ❄️', 'Febrero ❤️', 'Marzo 🌱', 'Abril 🌧️',
      'Mayo 🌼', 'Junio ☀️', 'Julio 🔥', 'Agosto 🌞',
      'Septiembre 🍂', 'Octubre 🎃', 'Noviembre 🍁', 'Diciembre 🎄'
    ]

    const date = new Date()
    const footer = `\n\n> ${botName} — ${date.getDate()} de ${monthNames[date.getMonth()]} de ${date.getFullYear()}`

    if (!text && !m.quoted) {
      await conn.reply(
        m.chat,
        '*⚠️ Debes escribir un mensaje o responder a uno para usar este comando.*',
        m
      )
      processing = false
      return processQueue(conn)
    }

    // 🔐 mentions ULTRA seguras
    const chunkSize = 25
    const chunks = []
    for (let i = 0; i < users.length; i += chunkSize) {
      chunks.push(users.slice(i, i + chunkSize))
    }

    for (const chunk of chunks) {

      let msg = {}

      if (text && !m.quoted) {
        msg = { text: text + footer, mentions: chunk }
      }

      if (m.quoted) {
        const q = m.quoted

        switch (q.mtype) {
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

      let sent = false
      let tries = 0

      while (!sent && tries < 3) {
        try {
          await conn.sendMessage(m.chat, msg, { quoted: m })
          sent = true
        } catch (e) {
          if (String(e).includes('rate-overlimit')) {
            await wait(4000) // 🧯 enfriar WhatsApp
            tries++
          } else {
            throw e
          }
        }
      }

      await wait(2200) // 🐢 delay REAL seguro
    }

  } catch (e) {
    console.error('HIDETAG ERROR:', e)
  }

  processing = false
  processQueue(conn)
}

const handler = async (m, { conn, text, participants }) => {
  if (!participants || participants.length < 2) return
  queue.push({ m, text, participants })
  processQueue(conn)
}

handler.help = ['hidetag']
handler.tags = ['group']
handler.command = /^(hidetag|ht|n)$/i
handler.group = true
handler.admin = true

export default handler
