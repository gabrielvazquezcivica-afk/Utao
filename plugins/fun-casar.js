// fun-casar.js

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

const handler = async (m, { conn, participants, isGroup }) => {
  if (!m.isGroup) throw '❌ Este comando solo funciona en grupos.'

  await conn.sendMessage(m.chat, {
    react: { text: '💍', key: m.key }
  })

  let parejas = loadParejas()

  let users = participants
    .map(u => u.id)
    .filter(v => v !== conn.user.jid)

  if (users.length < 2) throw '❌ No hay suficientes personas.'

  let p1 = users[Math.floor(Math.random() * users.length)]
  let p2
  do {
    p2 = users[Math.floor(Math.random() * users.length)]
  } while (p2 === p1)

  // Verificar si ya están casados
  if (parejas[p1] || parejas[p2]) {
    throw '💔 Uno de los usuarios ya está casado, no seas infiel 😡'
  }

  // Guardar pareja
  parejas[p1] = p2
  parejas[p2] = p1
  saveParejas(parejas)

  let texto = `
💒 *BODA OFICIAL* 💒

👰 @${p1.split('@')[0]}
🤵 @${p2.split('@')[0]}

💍 Quedan casados de por vida
📜 Guardado por el bot

😈 Prohibido divorciarse sin permiso
`.trim()

  await conn.sendMessage(
    m.chat,
    {
      text: texto,
      mentions: [p1, p2]
    },
    { quoted: m }
  )
}

handler.help = ['casar']
handler.tags = ['fun']
handler.command = ['casar', 'boda', 'matrimonio']

export default handler
