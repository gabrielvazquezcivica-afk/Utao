import fetch from 'node-fetch'

export default function autodetecNavidad(conn) {

  // ───── ABRIR / CERRAR GRUPO
  conn.ev.on('groups.update', async (updates) => {
    for (const update of updates) {
      try {
        if (!update.id || update.announce === undefined) continue

        const chat = global.db.data.chats[update.id]
        if (!chat || !chat.detect) continue

        // 🎅 Imagen navideña
        const santaImgUrl = global.navidadImg || 'https://i.imgur.com/9QO4K8K.png'
        const img = await (await fetch(santaImgUrl)).buffer()

        const texto = update.announce
          ? `🎄🔒 *¡HO HO HO!* 🔒🎄

El espíritu navideño ha decidido
que el grupo descanse un momento ❄️

🎅 *Solo los administradores*
pueden enviar mensajes ahora`

          : `🎄🔓 *¡FELIZ NAVIDAD!* 🔓🎄

Santa ha vuelto a abrir el grupo 🎁
y la conversación continúa ✨

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
        texto = `🎄🎅 *¡NUEVO GUARDIÁN NAVIDEÑO!* 🎅🎄

@${user.split('@')[0]}
ha sido elegido por Santa ✨

🛷 Ahora protege la paz del grupo`
      }

      if (anu.action === 'demote') {
        texto = `❄️🎄 *CAMBIO NAVIDEÑO* 🎄❄️

@${user.split('@')[0]}
deja su gorro de admin 🎅

🎁 Gracias por ayudar al grupo`
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
}      if (!chat || !chat.detect) return

      const user = anu.participants[0]
      let texto = ''

      if (anu.action === 'promote') {
        texto = `🎄🎅 *NUEVO ADMIN* 🎅🎄

👤 @${user.split('@')[0]}
✨ Protege el espíritu navideño`
      }

      if (anu.action === 'demote') {
        texto = `❄️🎄 *ADMIN REMOVIDO* 🎄❄️

👤 @${user.split('@')[0]}
🎅 Gracias por tu apoyo`
      }

      if (!texto) return

      let pp = await conn.profilePictureUrl(user, 'image').catch(() => null)
      let img = pp ? await (await fetch(pp)).buffer() : null

      await conn.sendMessage(anu.id, {
        text: texto,
        mentions: [user],
        contextInfo: img ? {
          externalAdReply: {
            showAdAttribution: true,
            renderLargerThumbnail: true,
            title: '🎄 ' + (global.packname || 'Bot'),
            body: 'Espíritu Navideño Activado',
            mediaType: 1,
            thumbnail: img,
            sourceUrl: global.channel || ''
          }
        } : {}
      })

    } catch (e) {
      console.log('Error _autodetec admin:', e)
    }
  })
}
