import fetch from 'node-fetch'

let handler = m => m
let detectEventsLoaded = false

// 🎄 fkontak navideño
const fkontak = async () => ({
  key: {
    participants: "0@s.whatsapp.net",
    remoteJid: "status@broadcast",
    fromMe: false,
    id: "NavidadBot"
  },
  message: {
    locationMessage: {
      name: "🎄 HUTAO BOT ❄️",
      jpegThumbnail: await (await fetch('https://files.catbox.moe/1j784p.jpg')).buffer()
    }
  },
  participant: "0@s.whatsapp.net"
})

handler.before = async function (m, { conn }) {
  if (detectEventsLoaded) return
  detectEventsLoaded = true

  // 🎄 Abrir / cerrar / configuración
  conn.ev.on('groups.update', async ([update]) => {
    if (!update?.id) return
    const chat = global.db.data.chats[update.id]
    if (!chat?.detect) return

    let quoted = await fkontak()
    let user = update.author ? `@${update.author.split('@')[0]}` : ''

    if (update.announce !== undefined) {
      await conn.sendMessage(update.id, {
        text: `🎄 El grupo fue *${update.announce ? 'cerrado 🔒' : 'abierto 🔓'}*\n❄️ Por: ${user}`,
        mentions: update.author ? [update.author] : []
      }, { quoted })
    }

    if (update.restrict !== undefined) {
      await conn.sendMessage(update.id, {
        text: `❄️ Configuración actualizada\n🎄 Solo *${update.restrict ? 'admins' : 'todos'}* editan info\n🎅 Por: ${user}`,
        mentions: update.author ? [update.author] : []
      }, { quoted })
    }
  })

  // 🎅 Admins
  conn.ev.on('group-participants.update', async (update) => {
    const chat = global.db.data.chats[update.id]
    if (!chat?.detect) return

    let quoted = await fkontak()

    for (let u of update.participants) {

      if (update.action === 'promote') {
        await conn.sendMessage(update.id, {
          text: `🎄👑 @${u.split('@')[0]} ahora es admin\n🎅 Por: @${update.author.split('@')[0]}`,
          mentions: [u, update.author]
        }, { quoted })
      }

      if (update.action === 'demote') {
        await conn.sendMessage(update.id, {
          text: `❄️🗑️ @${u.split('@')[0]} dejó de ser admin\n🎅 Por: @${update.author.split('@')[0]}`,
          mentions: [u, update.author]
        }, { quoted })
      }
    }
  })
}

export default handler
