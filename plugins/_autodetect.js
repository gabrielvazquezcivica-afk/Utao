import fetch from 'node-fetch'

export default function autodetecNavidad(conn) {

  // ───── ABRIR / CERRAR GRUPO
  conn.ev.on('groups.update', async (updates) => {
    for (const update of updates) {
      try {
        if (!update.id || update.announce === undefined) continue

        const chat = global.db.data.chats[update.id]
        if (!chat || !chat.detect) continue

        let texto = update.announce
          ? `🎄❄️ *GRUPO CERRADO* ❄️🎄

🔒 Solo administradores pueden escribir
🎅 Modo navideño activado`

          : `🎄✨ *GRUPO ABIERTO* ✨🎄

🔓 Todos pueden escribir
🎁 Feliz conversación navideña`

        await conn.sendMessage(update.id, { text: texto })

      } catch (e) {
        console.log('Error _autodetec group:', e)
      }
    }
  })

  // ───── ADMIN / QUITAR ADMIN
  conn.ev.on('group-participants.update', async (anu) => {
    try {
      const chat = global.db.data.chats[anu.id]
      if (!chat || !chat.detect) return

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
