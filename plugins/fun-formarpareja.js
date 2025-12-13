// fun-formarpareja.js

const handler = async (m, { conn, participants, isGroup }) => {
if (!m.isGroup) throw '❌ Este comando solo funciona en grupos.'
  // Reacción al comando
  await conn.sendMessage(m.chat, {
    react: { text: '💘', key: m.key }
  })

  // Filtrar usuarios (sin el bot)
  let users = participants
    .map(u => u.id)
    .filter(v => v !== conn.user.jid)

  if (users.length < 2) throw '❌ Se necesitan al menos 2 personas.'

  // Elegir pareja
  let pareja1 = users[Math.floor(Math.random() * users.length)]
  let pareja2
  do {
    pareja2 = users[Math.floor(Math.random() * users.length)]
  } while (pareja2 === pareja1)

  let porcentaje = Math.floor(Math.random() * 101)

  let texto = `
💖 *FORMANDO PAREJA* 💖

🥰 @${pareja1.split('@')[0]}
😍 @${pareja2.split('@')[0]}

❤️ Compatibilidad: *${porcentaje}%*

${porcentaje > 70 ? '🔥 Amor verdadero' :
  porcentaje > 40 ? '💫 Puede funcionar' :
  '💔 Mejor ni lo intenten'}

😏 Dictado por el bot...
`.trim()

  await conn.sendMessage(
    m.chat,
    {
      text: texto,
      mentions: [pareja1, pareja2]
    },
    { quoted: m }
  )
}

handler.help = ['formarpareja']
handler.tags = ['fun']
handler.command = ['formarpareja', 'pareja', 'ship']

export default handler
