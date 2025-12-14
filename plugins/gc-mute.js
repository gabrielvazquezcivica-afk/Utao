import fs from 'fs'

const DB_PATH = './database/muted-users.json'

// Crear DB si no existe
if (!fs.existsSync(DB_PATH)) {
  fs.mkdirSync('./database', { recursive: true })
  fs.writeFileSync(DB_PATH, JSON.stringify({}))
}

const loadMuted = () => JSON.parse(fs.readFileSync(DB_PATH))
const saveMuted = (data) => fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2))

// ================= COMANDO =================
let handler = async (m, { conn, isAdmin, isBotAdmin }) => {
  if (!m.isGroup) return
  if (!isAdmin) return
  if (!isBotAdmin) return

  let user = m.mentionedJid?.[0] || m.quoted?.sender
  if (!user) return

  let data = loadMuted()
  let group = m.chat
  data[group] = data[group] || []

  // 🔓 UNMUTE
  if (/unmute/i.test(m.text)) {
    data[group] = data[group].filter(u => u !== user)
    saveMuted(data)

    return conn.sendMessage(m.chat, {
      text:
        `✅ *Usuario desmuteado:* @${user.split('@')[0]}\n\n` +
        `🔔 Ahora puede enviar mensajes nuevamente.`,
      mentions: [user]
    })
  }

  // 🔒 MUTE
  if (!data[group].includes(user))
    data[group].push(user)

  saveMuted(data)

  return conn.sendMessage(m.chat, {
    text:
      `✅ *Usuario muteado:* @${user.split('@')[0]}\n\n` +
      `⚠️ Ahora se eliminarán sus mensajes automáticamente`,
    mentions: [user]
  })
}

// ================= BORRADO REAL (HuTao) =================
handler.all = async (m, { conn, isBotAdmin }) => {
  if (!m.isGroup) return
  if (!isBotAdmin) return
  if (m.fromMe) return
  if (!m.key?.id) return

  let data = loadMuted()
  let muted = data[m.chat] || []

  if (!muted.includes(m.sender)) return

  try {
    await conn.sendMessage(m.chat, {
      delete: m.key
    })
  } catch {}
}

handler.help = ['mute', 'unmute']
handler.tags = ['group']
handler.command = /^(mute|unmute)$/i
handler.group = true
handler.admin = true
handler.botAdmin = true

export default handler
