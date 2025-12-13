// fun-topparejas.js

import fs from 'fs'
import path from 'path'

const parejasPath = path.join(process.cwd(), 'database', 'parejas.json')

const loadParejas = () => {
  if (!fs.existsSync(parejasPath)) return {}
  return JSON.parse(fs.readFileSync(parejasPath))
}

const handler = async (m, { conn }) => {
  if (!m.isGroup) {
    return conn.reply(m.chat, '❌ Este comando solo funciona en grupos.', m)
  }

  // Reacción
  await conn.sendMessage(m.chat, {
    react: { text: '💘', key: m.key }
  })

  const data = loadParejas()
  const groupId = m.chat

  if (!data[groupId] || Object.keys(data[groupId]).length === 0) {
    return conn.reply(
      m.chat,
      '💔 No hay parejas registradas en este grupo.',
      m
    )
  }

  // Obtener parejas únicas
  let parejasUnicas = []
  let usados = new Set()

  for (let user in data[groupId]) {
    let pareja = data[groupId][user]
    if (usados.has(user) || usados.has(pareja)) continue
    usados.add(user)
    usados.add(pareja)
    parejasUnicas.push([user, pareja])
  }

  if (parejasUnicas.length === 0) {
    return conn.reply(
      m.chat,
      '💔 No hay parejas válidas en este grupo.',
      m
    )
  }

  let texto = `💖 *TOP 5 PAREJAS DEL GRUPO* 💖\n\n`
  let mentions = []

  for (let i = 1; i <= 5; i++) {
    let pareja = parejasUnicas[
      Math.floor(Math.random() * parejasUnicas.length)
    ]

    texto += `${i}. 💍 @${pareja[0].split('@')[0]} ❤️ @${pareja[1].split('@')[0]}\n`
    mentions.push(pareja[0], pareja[1])
  }

  texto += `\n😈 Ranking totalmente injusto`

  await conn.sendMessage(
    m.chat,
    {
      text: texto,
      mentions
    },
    { quoted: m }
  )
}

handler.help = ['topparejas']
handler.tags = ['fun']
handler.command = ['topparejas', 'topmatrimonios']

export default handler
