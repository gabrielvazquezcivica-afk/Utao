import fetch from 'node-fetch'

let handler = m => m

// 🎄 fkontak navideño
const fkontak = async () => ({
  key: {
    participants: '0@s.whatsapp.net',
    remoteJid: 'status@broadcast',
    fromMe: false,
    id: 'NavidadBot'
  },
  message: {
    locationMessage: {
      name: '🎄 HUTAO BOT ❄️',
      jpegThumbnail: await (await fetch('https://files.catbox.moe/1j784p.jpg')).buffer()
    }
  },
  participant: '0@s.whatsapp.net'
})

handler.before = async function (m, { conn }) {

  // 🔒 Evita duplicar listeners por conexión
  if (conn.detectLoaded) return
  conn.detectLoaded = true

  // ─────────────── 📢 ABRIR / CERRAR / CONFIG ───────────────
  conn.ev.on('groups.update', async ([update]) => {
    try {
      if (!update?.id) return

      const chat = global.db.data.chats?.[update.id]
      if (!chat?.detect) return

      let quoted = await fkontak()
      let author = update.author || '0@s.whatsapp.net'
      let user = author !== '0@s.whatsapp.net'
        ? `@${author.split('@')[0]}`
        : 'Sistema'

      if (update.announce !== undefined) {
        await conn.sendMessage(update.id, {
          text: `🎄 El grupo fue *${update.announce ? 'cerrado 🔒' : 'abierto 🔓'}*\n❄️ Por: ${user}`,
          mentions: author !== '0@s.whatsapp.net' ? [author] : []
        }, { quoted })
      }

      if (update.restrict !== undefined) {
        await conn.sendMessage(update.id, {
          text: `❄️ Configuración actualizada\n🎄 Solo *${update.restrict ? 'admins' : 'todos'}* editan info\n🎅 Por: ${user}`,
          mentions: author !== '0@s.whatsapp.net' ? [author] : []
        }, { quoted })
      }

    } catch (e) {
      console.error('[DETECT groups.update]', e)
    }
  })

  // ─────────────── 👑 PROMOTE / DEMOTE ───────────────
  conn.ev.on('group-participants.update', async (update) => {
    try {
      if (!update?.id) return

      const chat = global.db.data.chats?.[update.id]
      if (!chat?.detect) return

      let quoted = await fkontak()
      let author = update.author || '0@s.whatsapp.net'
      let authorTag = author !== '0@s.whatsapp.net'
        ? `@${author.split('@')[0]}`
        : 'Sistema'

      for (let user of update.participants) {

        if (update.action === 'promote') {
          await conn.sendMessage(update.id, {
            text: `🎄👑 @${user.split('@')[0]} ahora es admin\n🎅 Por: ${authorTag}`,
            mentions: author !== '0@s.whatsapp.net'
              ? [user, author]
              : [user]
          }, { quoted })
        }

        if (update.action === 'demote') {
          await conn.sendMessage(update.id, {
            text: `❄️🗑️ @${user.split('@')[0]} dejó de ser admin\n🎅 Por: ${authorTag}`,
            mentions: author !== '0@s.whatsapp.net'
              ? [user, author]
              : [user]
          }, { quoted })
        }
      }

    } catch (e) {
      console.error('[DETECT participants.update]', e)
    }
  })
}

export default handler
