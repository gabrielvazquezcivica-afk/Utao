let handler = {}

handler.before = async function (m, { conn }) {
  // Solo grupos y eventos
  if (!m.isGroup) return
  if (!m.messageStubType) return

  let chat = global.db.data.chats?.[m.chat]
  if (!chat || !chat.welcome) return

  // JID real (puede ser @lid)
  let who = m.messageStubParameters?.[0]
  if (!who) return

  let mention = '@' + who.split('@')[0]

  // FRASES PESADAS 😈
  const welcomes = [
    '🚨 Llegó alguien que nadie pidió',
    '🔥 Se sumó otro problema al grupo',
    '🤡 Nuevo payaso desbloqueado',
    '🧨 Esto se va a poner feo',
    '😈 Agárrense que llegó'
  ]

  const byes = [
    '🚪 Se fue sin avisar',
    '💀 Eliminado del servidor',
    '🪦 No sobrevivió al grupo',
    '💨 Huyó antes del desastre',
    '⚰️ Cayó otro soldado'
  ]

  let text =
    m.messageStubType === 27
      ? welcomes[Math.floor(Math.random() * welcomes.length)]
      : byes[Math.floor(Math.random() * byes.length)]

  let title =
    m.messageStubType === 27 ? '🔥 BIENVENIDO 🔥' : '💀 DESPEDIDA 💀'

  let box = `
╔════════════════════════════╗
║        ${title}        ║
╠════════════════════════════╣
║  ${text}
║
║  👤 ${mention}
╚════════════════════════════╝
`.trim()

  // FOTO PERFIL
  let pp
  try {
    pp = await conn.profilePictureUrl(who, 'image')
  } catch {
    try {
      pp = await conn.profilePictureUrl(conn.user.jid, 'image')
    } catch {
      pp = null
    }
  }

  // ENTRA
  if (m.messageStubType === 27) {
    await conn.sendMessage(m.chat, {
      image: pp ? { url: pp } : undefined,
      caption: box,
      mentions: [who]
    })
  }

  // SALE / EXPULSADO
  if (m.messageStubType === 28 || m.messageStubType === 32) {
    await conn.sendMessage(m.chat, {
      image: pp ? { url: pp } : undefined,
      caption: box,
      mentions: [who]
    })
  }
}

export default handler
