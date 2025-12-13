let handler = async function (m, { conn }) {

  if (!m.isGroup) return
  if (!m.messageStubType) return

  let chat = global.db.data.chats[m.chat]
  if (!chat || !chat.welcome) return

  let raw = m.messageStubParameters?.[0]
  if (!raw) return

  // 🔥 convertir @lid → jid normal
  let userJid = raw.replace('@lid', '@s.whatsapp.net')
  let mention = '@' + userJid.split('@')[0]

  // audios
  let audioWelcome = 'https://d.uguu.se/woNwUdOC.mp3'
  let audioBye = 'https://o.uguu.se/AGcyxnDN.mp3'

  let name = await conn.getName(userJid)

  const welcomes = [
    `🩸 *Otro error llegó* 🩸\n${mention} entró… nadie lo pidió.`,
    `👹 *Nuevo NPC detectado* 👹\n${mention} piensa que aquí importa.`,
    `💀 *Mala noticia* 💀\n${mention} acaba de entrar.`
  ]

  const byes = [
    `⚰️ *Buenas noticias* ⚰️\n${mention} se fue.`,
    `🗑️ *Basura retirada* 🗑️\n${mention} salió del grupo.`,
    `🔥 *Alivio total* 🔥\n${mention} ya no está aquí.`
  ]

  let pick = arr => arr[Math.floor(Math.random() * arr.length)]

  // ===== ENTRÓ =====
  if (m.messageStubType === 27) {
    await conn.sendMessage(m.chat, {
      text: pick(welcomes),
      mentions: [userJid]
    })

    await conn.sendMessage(m.chat, {
      audio: { url: audioWelcome },
      ptt: true,
      mimetype: 'audio/mpeg'
    })
  }

  // ===== SALIÓ / KICK =====
  if (m.messageStubType === 28 || m.messageStubType === 32) {
    await conn.sendMessage(m.chat, {
      text: pick(byes),
      mentions: [userJid]
    })

    await conn.sendMessage(m.chat, {
      audio: { url: audioBye },
      ptt: true,
      mimetype: 'audio/mpeg'
    })
  }
}

handler.before = true
export default handler
