let handler = async (m, { conn, args, command }) => {

  let option = (args[0] || '').toLowerCase()

  let isClose = {
    'open': 'not_announcement',
    'abrir': 'not_announcement',
    'abierto': 'not_announcement',

    'close': 'announcement',
    'cerrar': 'announcement',
    'cerrado': 'announcement'
  }[option]

  if (!isClose)
    return conn.reply(
      m.chat,
      `*Elija una opción*\n\nEjemplo:\n○ !${command} abrir\n○ !${command} cerrar`,
      m
    )

  // ⚙️ Abrir / cerrar grupo
  await conn.groupSettingUpdate(m.chat, isClose)

  // 😀 SOLO REACCIÓN
  await conn.sendMessage(m.chat, {
    react: {
      text: isClose === 'announcement' ? '🔐' : '🔓',
      key: m.key
    }
  })
}

handler.help = ['grupo abrir', 'grupo cerrar', 'cerrar', 'abrir']
handler.tags = ['grupo']
handler.command = ['group', 'grupo']
handler.admin = true
handler.botAdmin = true

export default handler
