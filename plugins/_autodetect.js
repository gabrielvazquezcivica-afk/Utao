import fetch from 'node-fetch'

let handler = m => m

// ================= MENSAJE CONTACTO (fkontak)
const fkontak = async () => ({
  key: {
    participants: "0@s.whatsapp.net",
    remoteJid: "status@broadcast",
    fromMe: false,
    id: "AlienMenu"
  },
  message: {
    locationMessage: {
      name: "*HUTAO BOT*",
      jpegThumbnail: await (await fetch('https://files.catbox.moe/1j784p.jpg')).buffer()
    }
  },
  participant: "0@s.whatsapp.net"
})

// ================= EVENTOS DE GRUPO
handler.before = async function (m, { conn }) {

  // ===== GRUPOS UPDATE (abrir, cerrar, editar info)
  conn.ev.on('groups.update', async ([update]) => {
    if (!update?.id) return

    const chat = global.db.data.chats[update.id]
    if (!chat?.detect) return

    let usuario = update.author ? `@${update.author.split('@')[0]}` : ''
    let quoted = await fkontak()

    // 🔒 Abrir / cerrar grupo
    if (update.announce !== undefined) {
      let txt = `🗣️ El grupo ha sido *${update.announce ? 'cerrado' : 'abierto'}*\n\n`
      txt += `> 💬 Ahora *${update.announce ? 'solo admins' : 'todos'}* pueden enviar mensajes.\n`
      txt += usuario ? `\n> 💫 Acción realizada por: ${usuario}` : ''

      await conn.sendMessage(update.id, {
        text: txt,
        mentions: update.author ? [update.author] : []
      }, { quoted })
    }

    // ⚙️ Editar info del grupo
    if (update.restrict !== undefined) {
      let txt = `⚙️ Configuración del grupo actualizada\n\n`
      txt += `> 🔒 Ahora *${update.restrict ? 'solo administradores' : 'todos'}* pueden editar la información.\n`
      txt += usuario ? `\n> 💫 Acción realizada por: ${usuario}` : ''

      await conn.sendMessage(update.id, {
        text: txt,
        mentions: update.author ? [update.author] : []
      }, { quoted })
    }
  })

  // ===== PARTICIPANTES UPDATE (admins)
  conn.ev.on('group-participants.update', async (update) => {
    const chat = global.db.data.chats[update.id]
    if (!chat?.detect) return

    let quoted = await fkontak()

    for (let user of update.participants) {

      // 👑 Nuevo admin
      if (update.action === 'promote') {
        let txt = `👑 @${user.split('@')[0]} *¡Ahora es administrador del grupo!*\n\n`
        txt += `> 💫 Acción realizada por: @${update.author.split('@')[0]}`

        await conn.sendMessage(update.id, {
          text: txt,
          mentions: [user, update.author]
        }, { quoted })
      }

      // 🗑️ Admin removido
      if (update.action === 'demote') {
        let txt = `🗑️ @${user.split('@')[0]} *ha dejado de ser administrador del grupo.*\n\n`
        txt += `> 💫 Acción realizada por: @${update.author.split('@')[0]}`

        await conn.sendMessage(update.id, {
          text: txt,
          mentions: [user, update.author]
        }, { quoted })
      }
    }
  })
}

export default handler
