import fetch from 'node-fetch'

export default function autodetecNavidad(conn) {

  conn.ev.on('messages.upsert', async ({ messages }) => {
    for (const m of messages) {
      try {
        if (!m.messageStubType) continue
        if (!m.key?.remoteJid?.endsWith('@g.us')) continue

        const chatId = m.key.remoteJid
        const chat = global.db.data.chats?.[chatId]
        if (!chat || !chat.detect) continue

        // 🔒 ABRIR / CERRAR GRUPO
        if (m.messageStubType === 26) {
          const cerrado = m.messageStubParameters?.[0] === 'on'

          // ❌ si el bot hizo el cambio, WhatsApp no permite banner
          if (m.key.fromMe) {
            console.log('[AUTODETECT] Cambio hecho por el bot, sin banner')
            return
          }

          const texto = cerrado
            ? `🎄🔒 *¡HO HO HO!* 🔒🎄

Santa ha cerrado el grupo ❄️
🎅 Solo administradores pueden escribir`
            : `🎄🔓 *¡FELIZ NAVIDAD!* 🔓🎄

Santa ha abierto el grupo 🎁
✨ Todos pueden enviar mensajes`

          // 🎅 imagen del banner
          const santaImg =
            global.navidadImg || 'https://i.imgur.com/9QO4K8K.png'

          const img = await (await fetch(santaImg))
            .arrayBuffer()
            .then(b => Buffer.from(b))

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
