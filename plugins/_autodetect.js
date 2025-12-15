import fetch from 'node-fetch'

let handler = m => m

// ========= bandera para evitar listeners duplicados
let detectEventsLoaded = false

// ========= mensaje contacto
const fkontak = async () => ({
  key: {
    participants: "0@s.whatsapp.net",
    remoteJid: "status@broadcast",
    fromMe: false,
    id: "AlienMenu"
  },
  message: {
    locationMessage: {
      name: "*Sasuke Bot MD 🌀*",
      jpegThumbnail: await (await fetch('https://files.catbox.moe/1j784p.jpg')).buffer()
    }
  },
  participant: "0@s.whatsapp.net"
})

handler.before = async function (m, { conn }) {

  // ⛔ evitar múltiples registros
  if (detectEventsLoaded) return
  detectEventsLoaded = true

  // ====== GRUPO UPDATE
  conn.ev.on('groups.update', async ([update]) => {
    if (!update?.id) return
    const chat = global.db.data.chats[update.id]
    if (!chat?.detect) return

    let quoted = await fkontak()
    let usuario = update.author ? `@${update.author.split('@')[0]}` : ''

    if (update.announce !== undefined) {
      await conn.sendMessage(update.id, {
        text: `🗣️ El grupo ha sido *${update.announce ? 'cerrado' : 'abierto'}*\n\n> 💬 Ahora *${update.announce ? 'solo admins' : 'todos'}* pueden enviar mensajes.\n\n> 💫 Acción realizada por: ${usuario}`,
        mentions: update.author ? [update.author] : []
      }, { quoted })
    }

    if (update.restrict !== undefined) {
      await conn.sendMessage(update.id, {
        text: `⚙️ Configuración del grupo actualizada\n\n> 🔒 Ahora *${update.restrict ? 'solo administradores' : 'todos'}* pueden editar la información.\n\n> 💫 Acción realizada por: ${usuario}`,
        mentions: update.author ? [update.author] : []
      }, { quoted })
    }
  })

  // ====== PARTICIPANTES UPDATE
  conn.ev.on('group-participants.update', async (update) => {
    const chat = global.db.data.chats[update.id]
    if (!chat?.detect) return

    let quoted = await fkontak()

    for (let user of update.participants) {

      if (update.action === 'promote') {
        await conn.sendMessage(update.id, {
          text: `👑 @${user.split('@')[0]} *¡Ahora es administrador del grupo!*\n\n> 💫 Acción realizada por: @${update.author.split('@')[0]}`,
          mentions: [user, update.author]
        }, { quoted })
      }

      if (update.action === 'demote') {
        await conn.sendMessage(update.id, {
          text: `🗑️ @${user.split('@')[0]} *ha dejado de ser administrador del grupo.*\n\n> 💫 Acción realizada por: @${update.author.split('@')[0]}`,
          mentions: [user, update.author]
        }, { quoted })
      }
    }
  })
}

export default handler
