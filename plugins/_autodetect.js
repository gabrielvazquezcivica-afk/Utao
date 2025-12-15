import fetch from 'node-fetch'

export default function autodetecNavidad(conn) {

  conn.ev.on('messages.upsert', async ({ messages }) => {
    for (const m of messages) {
      try {
        if (!m.messageStubType || !m.key.remoteJid.endsWith('@g.us')) continue

        const chatId = m.key.remoteJid
        const chat = global.db.data.chats[chatId]
        if (!chat || !chat.detect) continue

        const santaImgUrl = global.navidadImg || 'https://i.imgur.com/9QO4K8K.png'
        const img = await (await fetch(santaImgUrl)).buffer()

        // 🔒 ABRIR / CERRAR GRUPO
        if (m.messageStubType === 26) {
          const cerrado = m.messageStubParameters?.[0] === 'on'

          const texto = cerrado
            ? `🎄🔒 *¡HO HO HO!* 🔒🎄

Santa ha cerrado el grupo ❄️
Solo administradores pueden escribir 🎅`
            : `🎄🔓 *¡FELIZ NAVIDAD!* 🔓🎄

Santa ha abierto el grupo 🎁
Todos pueden enviar mensajes ✨`

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

        // ✏️ SOLO ADMINS EDITAN INFO
        if (m.messageStubType === 25) {
          const soloAdmins = m.messageStubParameters?.[0] === 'on'

          const texto = soloAdmins
            ? `🎄🔒 *Modo navideño activado* 🎄

🎅 Solo administradores
pueden editar la info del grupo`
            : `🎄✨ *Modo libre activado* ✨🎄

🎁 Todos pueden editar
la info del grupo`

          await conn.sendMessage(chatId, {
            text: texto,
            contextInfo: {
              externalAdReply: {
                showAdAttribution: true,
                renderLargerThumbnail: true,
                title: 'WhatsApp • Estado',
                body: 'Configuración del grupo',
                mediaType: 1,
                thumbnail: img,
                sourceUrl: global.channel || ''
              }
            }
          })
        }

      } catch (e) {
        console.log('Error autodetect stub:', e)
      }
    }
  })
}
