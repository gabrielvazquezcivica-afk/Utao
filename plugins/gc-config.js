let handler = async (m, { conn, args, command }) => {

  let option = (args[0] || command || '').toLowerCase()

  let isClose = {
    open: 'not_announcement',
    abrir: 'not_announcement',
    abierto: 'not_announcement',

    close: 'announcement',
    cerrar: 'announcement',
    cerrado: 'announcement'
  }[option]

  if (!isClose) return

  // 🔒 guardamos marca para autodetect
  conn.groupDetectFromCommand ??= {}
  conn.groupDetectFromCommand[m.chat] = true

  await conn.groupSettingUpdate(m.chat, isClose)

  // 👉 SOLO reacción
  await conn.sendMessage(m.chat, {
    react: {
      text: isClose === 'announcement' ? '🔐' : '🔓',
      key: m.key
    }
  })
}

handler.command = ['grupo', 'group', 'abrir', 'cerrar']
handler.admin = true
handler.botAdmin = true
export default handler
