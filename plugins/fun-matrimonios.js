// fun-matrimonios.js

import fs from 'fs'
import path from 'path'

const parejasPath = path.join(process.cwd(), 'database', 'parejas.json')

const loadParejas = () => {
  if (!fs.existsSync(parejasPath)) return {}
  return JSON.parse(fs.readFileSync(parejasPath))
}

const handler = async (m, { conn }) => {
  if (!m.isGroup) {
    return conn.reply(
      m.chat,
      '❌ Este comando solo funciona en grupos.',
      m
    )
  }

  // Reacción
  await conn.sendMessage(m.chat, {
    react: { text: '💍', key: m.key }
  })

  let data = loadParejas()
  let groupId = m.chat

  // Si no hay matrimonios en el grupo
  if (!data[groupId] || Object.keys(data[groupId]).length === 0) {
    return conn.reply(
      m.chat,
      '💔 *No hay matrimonios en este grupo.*\n😈 Todos siguen solteros.',
      m
    )
  }

  let vistos = new Set()
  let texto = `💒 *MATRIMONIOS DEL GRUPO* 💒\n\n`

  for (let user in data[groupId]) {
    let pareja = data[groupId][user]

    // Evitar duplicados
    if (vistos.has(user) || vistos.has(pareja)) continue

    vistos.add(user)
    vistos.add(pareja)

    texto += `💍 @${user.split('@')[0]}  ❤️  @${pareja.split('@')[0]}\n`
  }

  texto += `\n📜 Registro oficial del bot`

  await conn.sendMessage(
    m.chat,
    {
      text: texto,
      mentions: [...vistos]
    },
    { quoted: m }
  )
}

handler.help = ['matrimonios']
handler.tags = ['fun']
handler.command = ['matrimonios', 'bodas']

export default handler
