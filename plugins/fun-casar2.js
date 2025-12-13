// fun-casar2.js

import fs from 'fs'
import path from 'path'

const parejasPath = path.join(process.cwd(), 'database', 'parejas.json')

const loadParejas = () => {
  if (!fs.existsSync(parejasPath)) {
    fs.mkdirSync(path.dirname(parejasPath), { recursive: true })
    fs.writeFileSync(parejasPath, JSON.stringify({}, null, 2))
  }
  return JSON.parse(fs.readFileSync(parejasPath))
}

const saveParejas = (data) => {
  fs.writeFileSync(parejasPath, JSON.stringify(data, null, 2))
}

const handler = async (m, { conn }) => {
  if (!m.isGroup) throw '❌ Este comando solo funciona en grupos.'

  // Reacción
  await conn.sendMessage(m.chat, {
    react: { text: '💞', key: m.key }
  })

  let data = loadParejas()
  let groupId = m.chat

  if (!data[groupId]) data[groupId] = {}

  let user1 = m.sender

  // Obtener usuario mencionado o respondido
  let user2 =
    m.mentionedJid?.[0] ||
    (m.quoted ? m.quoted.sender : null)

  if (!user2) {
    throw '😡 Debes mencionar o responder a alguien para casarte.'
  }

  if (user1 === user2) {
    throw '🤡 No puedes casarte contigo mismo.'
  }

  // Verificar si ya están casados en este grupo
  if (data[groupId][user1] || data[groupId][user2]) {
    throw '💔 Uno de los dos ya está casado en este grupo.'
  }

  // Guardar matrimonio
  data[groupId][user1] = user2
  data[groupId][user2] = user1
  saveParejas(data)

  let texto = `
💒 *MATRIMONIO CONFIRMADO* 💒

👰 @${user1.split('@')[0]}
🤵 @${user2.split('@')[0]}

💍 Unidos oficialmente en este grupo
📜 Registro guardado por el bot

😈 Que dure… o no
`.trim()

  await conn.sendMessage(
    m.chat,
    {
      text: texto,
      mentions: [user1, user2]
    },
    { quoted: m }
  )
}

handler.help = ['casar2']
handler.tags = ['fun']
handler.command = ['casar2', 'casarme']

export default handler
