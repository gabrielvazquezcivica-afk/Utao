// fun-pareja.js

import fs from 'fs'
import path from 'path'

const parejasPath = path.join(process.cwd(), 'database', 'parejas.json')

const loadParejas = () => {
  if (!fs.existsSync(parejasPath)) return {}
  return JSON.parse(fs.readFileSync(parejasPath))
}

const handler = async (m, { conn, isGroup }) => {
  if (!isGroup) throw '❌ Este comando solo funciona en grupos.'

  // Reacción al comando
  await conn.sendMessage(m.chat, {
    react: { text: '💞', key: m.key }
  })

  let parejas = loadParejas()
  let user = m.sender

  if (!parejas[user]) {
    return conn.reply(
      m.chat,
      '💔 No estás casado con nadie.\n😈 Sigue soltero y llorando.',
      m
    )
  }

  let pareja = parejas[user]

  let texto = `
💍 *ESTADO CIVIL* 💍

😏 @${user.split('@')[0]}
❤️ Está casado con
😘 @${pareja.split('@')[0]}

📜 Registro oficial del bot
`.trim()

  await conn.sendMessage(
    m.chat,
    {
      text: texto,
      mentions: [user, pareja]
    },
    { quoted: m }
  )
}

handler.help = ['pareja']
handler.tags = ['fun']
handler.command = ['pareja', 'esposo', 'esposa']

export default handler
