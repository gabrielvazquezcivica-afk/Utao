export default function autodetecNavidad(conn) {

  // Detectar cambios del grupo (stub)
  conn.ev.on('messages.upsert', async ({ messages }) => {
    for (const m of messages) {
      try {
        if (!m.messageStubType) continue
        if (!m.key?.remoteJid?.endsWith('@g.us')) continue

        const chatId = m.key.remoteJid
        const chat = global.db.data.chats?.[chatId]
        if (!chat || !chat.detect) continue

        // Abrir / cerrar grupo
        if (m.messageStubType === 26) {
          const cerrado = m.messageStubParameters?.[0] === 'on'

          // ⚠️ Si el bot hizo el cambio, WhatsApp NO permite mensaje
          // solo log en consola
          if (m.key.fromMe) {
            console.log('[AUTODETECT] Cambio hecho por el bot:', cerrado ? 'cerrado' : 'abierto')
            return
          }

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
}
