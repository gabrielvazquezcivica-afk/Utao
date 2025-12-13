// fun-formarpareja.js (+18)

const handler = async (m, { conn, participants, isGroup }) => {
  if (!isGroup) throw '❌ Este comando solo funciona en grupos.'

  let users = participants
    .map(u => u.id)
    .filter(v => v !== conn.user.jid)

  if (users.length < 2) throw '❌ No hay suficientes víctimas 😏'

  let p1 = users[Math.floor(Math.random() * users.length)]
  let p2

  do {
    p2 = users[Math.floor(Math.random() * users.length)]
  } while (p2 === p1)

  let compat = Math.floor(Math.random() * 101)

  let nivel =
    compat > 85 ? '🔥 TERMINAN EN LA CAMA' :
    compat > 65 ? '😈 MUCHA TENSIÓN SEXUAL' :
    compat > 45 ? '🍷 UNOS BESOS Y COPAS' :
    compat > 25 ? '😶 SOLO MIRADAS INCÓMODAS' :
    '💀 NI EN PEDO'

  let texto = `
🔞 *FORMANDO PAREJA PROHIBIDA* 🔞

😏 @${p1.split('@')[0]}
😈 @${p2.split('@')[0]}

💦 Compatibilidad: *${compat}%*
📛 Resultado: *${nivel}*

🛏️ El bot recomienda:
${compat > 70
  ? 'Apagar las luces, cerrar la puerta y no hacer preguntas.'
  : compat > 40
  ? 'Un motel barato y alcohol.'
  : 'Mejor cada quien por su lado.'}

😼 Luego no digan que el bot no avisó…
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

handler.help = ['formarpareja18']
handler.tags = ['fun', 'adult']
handler.command = ['formarpareja18', 'pareja18', 'ship18']
handler.group = true

export default handler
