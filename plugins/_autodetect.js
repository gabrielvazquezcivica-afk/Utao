import fetch from 'node-fetch'

const delay = ms => new Promise(res => setTimeout(res, ms))

let lastStub = {}

export default function autodetecNavidad(conn) {

  conn.ev.on('messages.upsert', async ({ messages }) => {
    for (const m of messages) {
      try {
        if (!m.messageStubType) continue
        if (!m.key.remoteJid?.endsWith('@g.us')) continue

        const chatId = m.key.remoteJid
        const chat = global.db.data.chats[chatId]
        if (!chat || !chat.detect) continue

        // ❌ ignorar acciones hechas por el bot
        if (m.key.fromMe) continue

        // ❌ evitar duplicados
        const key = `${chatId}_${m.messageStubType}_${m.messageStubParameters?.[0]}`
        if (lastStub[key]) continue
        lastStub[key] = true
        setTimeout(() => delete lastStub[key], 5000)

        // ⏳ delay anti rate-limit
        await delay(1200)

        const santaImgUrl = global.navidadImg || 'https://i.imgur.com/9QO4K8K.png'
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
