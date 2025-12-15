import fetch from 'node-fetch'

export default function autodetecNavidad(conn) {

  // ───── ABRIR / CERRAR GRUPO
  conn.ev.on('groups.update', async (updates) => {
    for (const update of updates) {
      try {
        if (!update.id || update.announce === undefined) continue

        const chat = global.db.data.chats[update.id]
        if (!chat || !chat.detect) continue

        const santaImgUrl = global.navidadImg || 'https://i.imgur.com/9QO4K8K.png'
        const img = await (await fetch(santaImgUrl)).buffer()

        const texto = update.announce
          ? `🎄🔒 *¡HO HO HO!* 🔒🎄

El grupo ha entrado en modo descanso ❄️
Santa ha cerrado la conversación 🎅

✨ *Solo administradores pueden escribir*`
          : `🎄🔓 *¡FELIZ NAVIDAD!* 🔓🎄

Santa ha abierto el grupo 🎁
La charla puede continuar ✨

🎅 *Todos pueden enviar mensajes*`

        await conn.sendMessage(update.id, {
          text: texto,
          contextInfo: {
            externalAdReply: {
              showAdAttribution: true,
              renderLargerThumbnail: true,
              title: 'WhatsApp • Estado',
              body: update.announce
                ? 'El grupo ha sido cerrado'
                : 'El grupo ha sido abierto',
              mediaType: 1,
              thumbnail: img,
              sourceUrl: global.channel || ''
            }
          }
        })

      } catch (e) {
        console.log('Error autodetect grupo:', e)
      }
    }
  })

  // ───── PROMOVER / QUITAR ADMIN
  conn.ev.on('group-participants.update', async (anu) => {
    try {
      const chat = global.db.data.chats[anu.id]
      if (!chat || !chat.detect) return

      const user = anu.participants[0]
      let texto = ''

      if (anu.action === 'promote') {
        texto = `🎄🎅 *¡NUEVO ADMIN NAVIDEÑO!* 🎅🎄

@${user.split('@')[0]}
ha sido elegido por Santa ✨

🛷 Ahora cuida el grupo`
      }

      if (anu.action === 'demote') {
        texto = `❄️🎄 *CAMBIO NAVIDEÑO* 🎄❄️

@${user.split('@')[0]}
deja su gorro de admin 🎅

🎁 Gracias por tu apoyo`
      }

      if (!texto) return

      const santaImgUrl = global.navidadImg || 'https://i.imgur.com/9QO4K8K.png'
      const img = await (await fetch(santaImgUrl)).buffer()

      await conn.sendMessage(anu.id, {
        text: texto,
        mentions: [user],
        contextInfo: {
          mentionedJid: [user],
          externalAdReply: {
            showAdAttribution: true,
            renderLargerThumbnail: true,
            title: 'WhatsApp • Estado',
            body: 'Actualización navideña del grupo',
            mediaType: 1,
            thumbnail: img,
            sourceUrl: global.channel || ''
          }
        }
      })

    } catch (e) {
      console.log('Error autodetect admin:', e)
    }
  })
}
