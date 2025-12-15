import fetch from 'node-fetch'

let handler = m => m

// ─────── CACHE ───────
let fkontakCache
let lastDetect = {} // anti spam por grupo

const getFkontak = async () => {
  if (fkontakCache) return fkontakCache

  fkontakCache = {
    key: {
      participants: '0@s.whatsapp.net',
      remoteJid: 'status@broadcast',
      fromMe: false,
      id: 'DetectBot'
    },
    message: {
      locationMessage: {
        name: '📢 AUTODETECT',
        jpegThumbnail: await (await fetch(
          'https://files.catbox.moe/1j784p.jpg'
        )).buffer()
      }
    },
    participant: '0@s.whatsapp.net'
  }
  return fkontakCache
}

// ─────── COOLDOWN ───────
const canSend = (jid, time = 5000) => {
  const now = Date.now()
  if (lastDetect[jid] && now - lastDetect[jid] < time) return false
  lastDetect[jid] = now
  return true
}

handler.before = async function (m, { conn }) {

  if (conn.detectLoaded) return
  conn.detectLoaded = true

  // ───────── ABRIR / CERRAR ─────────
  conn.ev.on('groups.update', async ([update]) => {
    try {
      if (!update?.id) return

      const chat = global.db.data.chats?.[update.id]
      if (!chat?.detect) return
      if (!canSend(update.id)) return

      const quoted = await getFkontak()
      const author = update.author
      const user = author ? `@${author.split('@')[0]}` : 'Sistema'

      if (update.announce !== undefined) {
        await conn.sendMessage(update.id, {
          text: `🔔 El grupo fue *${update.announce ? 'CERRADO 🔒' : 'ABIERTO 🔓'}*\n👤 Por: ${user}`,
          mentions: author ? [author] : []
        }, { quoted })
      }

    } catch (e) {
      console.error('[DETECT groups.update]', e)
    }
  })

  // ───────── ADMINS ─────────
  conn.ev.on('group-participants.update', async (update) => {
    try {
      if (!update?.id) return

      const chat = global.db.data.chats?.[update.id]
      if (!chat?.detect) return
      if (!canSend(update.id)) return

      const quoted = await getFkontak()
      const author = update.author
      const authorTag = author ? `@${author.split('@')[0]}` : 'Sistema'

      for (let user of update.participants) {
        const u = `@${user.split('@')[0]}`

        if (update.action === 'promote') {
          await conn.sendMessage(update.id, {
            text: `👑 ${u} ahora es *ADMIN*\n👤 Por: ${authorTag}`,
            mentions: author ? [user, author] : [user]
          }, { quoted })
        }

        if (update.action === 'demote') {
          await conn.sendMessage(update.id, {
            text: `🗑️ ${u} ya no es admin\n👤 Por: ${authorTag}`,
            mentions: author ? [user, author] : [user]
          }, { quoted })
        }
      }

    } catch (e) {
      console.error('[DETECT participants]', e)
    }
  })
}

export default handler
