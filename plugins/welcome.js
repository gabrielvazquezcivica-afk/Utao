import fetch from 'node-fetch'

let handler = {}

handler.on = async function ({ id, participants, action }, { conn }) {
  let chat = global.db.data.chats[id]
  if (!chat?.welcome) return

  for (let user of participants) {

    let userJid = user.includes('@')
      ? user
      : user + '@s.whatsapp.net'

    let mention = '@' + userJid.split('@')[0]

    // ====== AUDIOS ======
    let audioWelcome = 'https://d.uguu.se/woNwUdOC.mp3'
    let audioBye = 'https://o.uguu.se/AGcyxnDN.mp3'

    // ====== FOTO PERFIL ======
    let ppUrl
    try {
      ppUrl = await conn.profilePictureUrl(userJid, 'image')
    } catch {
      ppUrl = await conn.profilePictureUrl(conn.user.jid, 'image')
    }

    let ppBuffer = await (await fetch(ppUrl)).buffer()
    let name = await conn.getName(userJid)

    // ===== MENSAJES =====
    const welcomes = [
      `🩸 *Llegó otro error* 🩸\n${mention} entró… nadie lo pidió.`,
      `👹 *Nuevo NPC* 👹\n${mention} piensa que aquí lo quieren.`,
      `💀 *Mala noticia* 💀\n${mention} acaba de entrar.`
    ]

    const byes = [
      `⚰️ *Buenas noticias* ⚰️\n${mention} se largó.`,
      `🗑️ *Basura retirada* 🗑️\n${mention} salió del grupo.`,
      `🔥 *Alivio total* 🔥\n${mention} ya no está aquí.`
    ]

    let pick = arr => arr[Math.floor(Math.random() * arr.length)]

    // ===== ENTRADA =====
    if (action === 'add') {
      await conn.sendMessage(id, {
        text: pick(welcomes),
        mentions: [userJid],
        contextInfo: {
          externalAdReply: {
            title: '🩸 BIENVENIDO 🩸',
            body: name,
            thumbnail: ppBuffer,
            mediaType: 1,
            showAdAttribution: true
          }
        }
      })

      await conn.sendMessage(id, {
        audio: { url: audioWelcome },
        ptt: true,
        mimetype: 'audio/mpeg',
        seconds: 8
      })
    }

    // ===== SALIDA =====
    if (action === 'remove') {
      await conn.sendMessage(id, {
        text: pick(byes),
        mentions: [userJid],
        contextInfo: {
          externalAdReply: {
            title: '⚰️ DESPEDIDA ⚰️',
            body: name,
            thumbnail: ppBuffer,
            mediaType: 1,
            showAdAttribution: true
          }
        }
      })

      await conn.sendMessage(id, {
        audio: { url: audioBye },
        ptt: true,
        mimetype: 'audio/mpeg',
        seconds: 6
      })
    }
  }
}

export default handler
