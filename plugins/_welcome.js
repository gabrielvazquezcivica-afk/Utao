let handler = {}

handler.before = async function (m, { conn }) {
  if (!m.isGroup) return true
  if (!m.messageStubType) return true

  let chat = global.db.data.chats[m.chat]
  if (!chat?.welcome) return true

  let userJid = m.messageStubParameters?.[0]
  if (!userJid) return true
  userJid += '@s.whatsapp.net'

  // AUDIOS
  let audioWelcome = 'https://d.uguu.se/woNwUdOC.mp3'
  let audioBye = 'https://o.uguu.se/AGcyxnDN.mp3'

  // FOTO PERFIL
  let pp
  try {
    pp = await conn.profilePictureUrl(userJid, 'image')
  } catch {
    pp = await conn.profilePictureUrl(conn.user.jid, 'image')
  }

  let name = await conn.getName(userJid)

  // MENSAJES RANDOM CRUELES
  const welcomeMessages = [
    `🩸 *Otro error llegó* 🩸\nBienvenido *${name}*, nadie te pidió.`,
    `🔥 *Se coló alguien más* 🔥\n*${name}* entró, qué desgracia.`,
    `👹 *Nuevo NPC detectado* 👹\nPasa *${name}*, pero no estorbes.`,
    `💀 *Respiren hondo* 💀\nLlegó *${name}*, lo sentimos.`,
  ]

  const byeMessages = [
    `⚰️ *Gracias al cielo* ⚰️\n*${name}* se fue.`,
    `🗑️ *Limpieza hecha* 🗑️\n*${name}* abandonó el grupo.`,
    `🔥 *Una buena noticia* 🔥\n*${name}* salió.`,
    `😮‍💨 *Alivio total* 😮‍💨\n*${name}* se largó.`,
  ]

  let pick = arr => arr[Math.floor(Math.random() * arr.length)]

  // ===== ENTRADA =====
  if (m.messageStubType === 27) {
    await conn.sendMessage(m.chat, {
      text: pick(welcomeMessages),
      contextInfo: {
        mentionedJid: [userJid],
        externalAdReply: {
          title: '🩸 BIENVENIDO 🩸',
          body: name,
          thumbnailUrl: pp,
          mediaType: 1,
          showAdAttribution: true
        }
      }
    })

    await conn.sendMessage(m.chat, {
      audio: { url: audioWelcome },
      ptt: true,
      mimetype: 'audio/mpeg'
    })
  }

  // ===== SALIDA / EXPULSADO =====
  if (m.messageStubType === 28 || m.messageStubType === 32) {
    await conn.sendMessage(m.chat, {
      text: pick(byeMessages),
      contextInfo: {
        mentionedJid: [userJid],
        externalAdReply: {
          title: '⚰️ DESPEDIDA ⚰️',
          body: `${name} salió del grupo`,
          thumbnailUrl: pp,
          mediaType: 1,
          showAdAttribution: true
        }
      }
    })

    await conn.sendMessage(m.chat, {
      audio: { url: audioBye },
      ptt: true,
      mimetype: 'audio/mpeg'
    })
  }

  return true
}

export default handler
