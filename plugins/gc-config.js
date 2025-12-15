let handler = async (m, { conn, args, command }) => {

  let opcion = (args[0] || '').toLowerCase()
  let accion = {
    'abrir': 'not_announcement',
    'open': 'not_announcement',
    'cerrar': 'announcement',
    'close': 'announcement'
  }[opcion]

  if (!accion) return

  // 🔒 Marca que fue por comando
  global.db.data.chats[m.chat].detectCmd = true
  global.db.data.chats[m.chat].detectTime = Date.now()

  await conn.groupSettingUpdate(m.chat, accion)

  // 🔁 SOLO reacción
  await conn.sendMessage(m.chat, {
    react: {
      text: accion === 'announcement' ? '🔐' : '🔓',
      key: m.key
    }
  })

}

handler.command = ['grupo', 'group', 'abrir', 'cerrar']
handler.admin = true
handler.botAdmin = true
export default handler
