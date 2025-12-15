import fetch from 'node-fetch'

const delay = ms => new Promise(r => setTimeout(r, ms))
let lastBotMessage = {}

export default function autodetecNavidad(conn) {

  // detectar cuando el bot habla
  conn.ev.on('messages.upsert', ({ messages }) => {
    for (const m of messages) {
      if (m.key.fromMe && m.key.remoteJid?.endsWith('@g.us')) {
        lastBotMessage[m.key.remoteJid] = Date.now()
      }
    }
  })

  // detectar stubs reales
  conn.ev.on('messages.upsert', async ({ messages }) => {
    for (const m of messages) {
      try {
        if (!m.messageStubType) continue
        if (!m.key.remoteJid?.endsWith('@g.us')) continue

        const chatId = m.key.remoteJid
        const chat = global.db.data.chats[chatId]
        if (!chat || !chat.detect) continue

        // ⏳ si fue por comando, esperar más
        const last = lastBotMessage[chatId] || 0
        if (Date.now() - last < 5000) {
          await delay(6500)
        } else {
          await delay(1500)
        }

        const santaImgUrl = global.navidadImg || 'https://i.imgur.com/9QO4K8K.png'
        const img = await (await fetch(santaImgUrl)).arrayBuffer()
          .then(b => Buffer.from(b))

        if (m.messageStubType === 26) {
          const cerrado = m.messageStubParameters?.[0] === 'on'

          const texto = cerrado
            ? `🎄🔒 *¡HO HO HO!* 🔒🎄

Santa ha cerrado el grupo ❄️
🎅 Solo administradores pueden escribir`
            : `🎄🔓 *¡FELIZ NAVIDAD!* 🔓🎄

Santa ha abierto el grupo 🎁
✨ Todos pueden enviar mensajes`

          await conn.sendMessage(chatId, {
            text: texto,
            contextInfo: {
              externalAdReply: {
                showAdAttribution: true,
                renderLargerThumbnail: true,
                title: 'WhatsApp • Estado',
                body: cerrado
                  ? 'El grupo ha sido cerrado'
                  : 'El grupo ha sido abierto',
                mediaType: 1,
                thumbnail: img,
                sourceUrl: global.channel || ''
              }
            }
          })
        }

      } catch (e) {
        console.log('Error autodetect stub:', e?.message || e)
      }
    }
  })
}        const santaImgUrl = global.navidadImg || 'https://i.imgur.com/9QO4K8K.png'
        const img = await (await fetch(santaImgUrl)).arrayBuffer()
          .then(b => Buffer.from(b))

        // 🔒 ABRIR / CERRAR
        if (m.messageStubType === 26) {
          const cerrado = m.messageStubParameters?.[0] === 'on'

          const texto = cerrado
            ? `🎄🔒 *¡HO HO HO!* 🔒🎄

Santa ha cerrado el grupo ❄️
🎅 Solo administradores pueden escribir`
            : `🎄🔓 *¡FELIZ NAVIDAD!* 🔓🎄

Santa ha abierto el grupo 🎁
✨ Todos pueden enviar mensajes`

          await conn.sendMessage(chatId, {
            text: texto,
            contextInfo: {
              externalAdReply: {
                showAdAttribution: true,
                renderLargerThumbnail: true,
                title: 'WhatsApp • Estado',
                body: cerrado
                  ? 'El grupo ha sido cerrado'
                  : 'El grupo ha sido abierto',
                mediaType: 1,
                thumbnail: img,
                sourceUrl: global.channel || ''
              }
            }
          })
        }

      } catch (e) {
        console.log('Error autodetect stub:', e?.message || e)
      }
    }
  })
}
