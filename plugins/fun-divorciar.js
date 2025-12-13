// fun-divorciar.js

import fs from 'fs'
import path from 'path'

const parejasPath = path.join(process.cwd(), 'database', 'parejas.json')

const loadParejas = () => {
  if (!fs.existsSync(parejasPath)) return {}
  return JSON.parse(fs.readFileSync(parejasPath))
}

const saveParejas = (data) => {
  fs.writeFileSync(parejasPath, JSON.stringify(data, null, 2))
}

const handler = async (m, { conn, isGroup }) => {
  if (!isGroup) throw '❌ Este comando solo funciona en grupos.'

  // Reacción al comando
  await conn.sendMessage(m.chat, {
    react: { text: '💔', key: m.key }
  })

  let parejas = loadParejas()
  let user = m.sender

  if (!parejas[user]) {
    throw '😹 No estás casado, no puedes divorciarte.'
  }

  let pareja = parejas[user]

  // Eliminar relación
  delete parejas[user]
  delete parejas[pareja]
  saveParejas(parejas)

  let texto = `
💔 *DIVORCIO FINALIZADO* 💔

💥 @${user.split('@')[0]}
💥 @${pareja.split('@')[0]}

📜 Matrimonio eliminado del registro
😈 Ahora cada quien por su lado

🍻 Libertad recuperada
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

handler.help = ['divorciar']
handler.tags = ['fun']
handler.command = ['divorciar', 'separar']

export default handler
