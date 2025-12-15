// ───── detectar cambios del grupo (stub)
conn.ev.on('messages.upsert', async ({ messages }) => {
  for (const m of messages) {
    try {
      if (!m.messageStubType) continue
      if (!m.key?.remoteJid?.endsWith('@g.us')) continue

      const chatId = m.key.remoteJid
      const chat = global.db.data.chats?.[chatId]
      if (!chat || !chat.detect) continue

      // 🔒 ABRIR / CERRAR
      if (m.messageStubType === 26) {
        const cerrado = m.messageStubParameters?.[0] === 'on'

        // 🤖 SI EL BOT HIZO EL CAMBIO → SOLO REACCIÓN
        if (m.key.fromMe) {
          await conn.sendMessage(chatId, {
            react: {
              text: cerrado ? '🔒🎄' : '🔓🎄',
              key: m.key
            }
          })
          return
        }

        // 🧍 SI FUE HUMANO → MENSAJE
        const texto = cerrado
          ? `🎄🔒 *¡HO HO HO!* 🔒🎄

Santa ha cerrado el grupo ❄️
🎅 Solo administradores pueden escribir`
          : `🎄🔓 *¡FELIZ NAVIDAD!* 🔓🎄

Santa ha abierto el grupo 🎁
✨ Todos pueden enviar mensajes`

        await conn.sendMessage(chatId, { text: texto })
      }

    } catch (e) {
      console.log('Error autodetect stub:', e?.message || e)
    }
  }
})
