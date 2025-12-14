import fs from 'fs'

const DB_PATH = './database/muted-users.json'

// 🎄 Emojis random
const muteEmojis = ['❄️','☃️','🎄','🥶','🌨️','🧊']
const unmuteEmojis = ['🎁','✨','🎄','🧑‍🎄','⭐','🔔']

// 🎅 Mensajes random
const muteTexts = [
  'Silencio cubierto de nieve',
  'Santa pidió silencio',
  'Modo invierno activado',
  'El frío llegó al chat',
  'Nieve en el micrófono',
  'Duendes trabajando en silencio'
]

const unmuteTexts = [
  'La magia volvió al chat',
  'Regalo navideño entregado',
  'Santa devolvió la voz',
  'Campanas sonando de nuevo',
  'El espíritu navideño habló',
  'Duendes felices otra vez'
]

const random = (arr) => arr[Math.floor(Math.random() * arr.length)]

// Crear DB si no existe
if (!fs.existsSync(DB_PATH)) {
  fs.mkdirSync('./database', { recursive: true })
  fs.writeFileSync(DB_PATH, JSON.stringify({}))
}

const loadMuted = () => JSON.parse(fs.readFileSync(DB_PATH))
const saveMuted = (data) => fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2))

let handler = async (m, { conn, isAdmin, isBotAdmin }) => {
  if (!m.isGroup) return

  if (!isAdmin)
    return m.reply('🎄 Solo los duendes admin pueden usar magia.')

  if (!isBotAdmin)
    return m.reply('🎅 Necesito gorrito de admin.')

  let user =
    m.mentionedJid?.[0] ||
    (m.quoted ? m.quoted.sender : null)

  if (!user) return

  let data = loadMuted()
  let group = m.chat
  data[group] = data[group] || []

  // 🎁 UNMUTE
  if (/unmute/i.test(m.text)) {
    data[group] = data[group].filter(u => u !== user)
    saveMuted(data)

    const emoji = random(unmuteEmojis)
    const text = random(unmuteTexts)

    await conn.sendMessage(m.chat, {
      react: { text: emoji, key: m.key }
    })

    return conn.sendMessage(m.chat, {
      text: `${emoji} *${text}*\n\n🎄 @${user.split('@')[0]}`,
      mentions: [user]
    })
  }

  // ❄️ MUTE
  if (!data[group].includes(user))
    data[group].push(user)

  saveMuted(data)

  const emoji = random(muteEmojis)
  const text = random(muteTexts)

  await conn.sendMessage(m.chat, {
    react: { text: emoji, key: m.key }
  })

  return conn.sendMessage(m.chat, {
    text: `${emoji} *${text}*\n\n☃️ @${user.split('@')[0]}`,
    mentions: [user]
  })
}

// ❄️ BORRADO AUTOMÁTICO (CORREGIDO)
handler.before = async (m, { conn, isBotAdmin }) => {
  if (!m.isGroup) return
  if (!isBotAdmin) return
  if (m.fromMe) return

  let data = loadMuted()
  let muted = data[m.chat] || []

  if (!muted.includes(m.sender)) return

  try {
    await conn.sendMessage(m.chat, {
      delete: m.key
    })
  } catch {}

  return true
}

handler.help = ['mute', 'unmute']
handler.tags = ['group']
handler.command = /^(mute|unmute)$/i
handler.group = true
handler.admin = true
handler.botAdmin = true

export default handler
