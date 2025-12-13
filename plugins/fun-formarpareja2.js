// fun-formarpareja.js (+18) CON REACCIÓN

const handler = async (m, { conn, participants, isGroup }) => {
  if (!m.isGroup) throw '❌ Este comando solo funciona en grupos.'

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
    compat > 85 ? '🔥 TERMINAN DESNUDOS' :
    compat > 65 ? '😈 MUCHA TENSIÓN SEXUAL' :
    compat > 45 ? '🍷 BESOS + ALCOHOL' :
    compat > 25 ? '😶 SOLO CALENTURA' :
    '💀 NI BORRACHOS'

  let texto = `
🔞 *PAREJA PROHIBIDA DETECTADA* 🔞

😏 @${p1.split('@')[0]}
😈 @${p2.split('@')[0]}

💦 Compatibilidad: *${compat}%*
📛 Resultado: *${nivel}*

🛏️ Consejo del bot:
${compat > 70
  ? 'Cierren la puerta y apaguen el celular.'
  : compat > 40
  ? 'Una noche, cero sentimientos.'
  : 'Mejor ni lo intenten.'}

😼 El bot solo observa…
`.trim()

  // 📩 Enviar mensaje
  let msg = await conn.sendMessage(
    m.chat,
    {
      text: texto,
      mentions: [p1, p2]
    },
    { quoted: m }
  )

  // 😈🔥 REACCIÓN AL MENSAJE
  await conn.sendMessage(m.chat, {
    react: {
      text: compat > 70 ? '🔥' : compat > 40 ? '😈' : '💀',
      key: msg.key
    }
  })
}

handler.help = ['formarpareja2']
handler.tags = ['fun', 'adult']
handler.command = ['formarpareja2', 'pareja2', 'ship2']
handler.group = true

export default handler
