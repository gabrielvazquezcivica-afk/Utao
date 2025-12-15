let handler = async (m, { conn, args, command }) => {

  let isClose = {
    'open': 'not_announcement',
    'abrir': 'not_announcement',
    'close': 'announcement',
    'cerrar': 'announcement'
  }[(args[0] || command)]

  if (!isClose) return

  await conn.groupSettingUpdate(m.chat, isClose)

  await conn.sendMessage(m.chat, {
    react: {
      text: isClose === 'announcement' ? '🔒🎄' : '🔓🎄',
      key: m.key
    }
  })
}

handler.command = ['group', 'grupo', 'abrir', 'cerrar']
handler.group = true
handler.admin = true
handler.botAdmin = true

export default handler
