let handler = async (m, { conn, args, command }) => {

  let action = (args[0] || '').toLowerCase()

  let map = {
    open: 'not_announcement',
    abrir: 'not_announcement',
    close: 'announcement',
    cerrar: 'announcement'
  }

  let isClose = map[action]
  if (!isClose) return

  // 🧠 MARCAR QUE VIENE DE COMANDO
  global.groupCommandDetect ??= {}
  global.groupCommandDetect[m.chat] = Date.now()

  await conn.groupSettingUpdate(m.chat, isClose)

  // 🔐 SOLO REACCIÓN
  let emoji = isClose === 'announcement' ? '🔐' : '🔓'
  await conn.sendMessage(m.chat, { react: { text: emoji, key: m.key } })

}
handler.admin = true
handler.botAdmin = true
handler.command = ['grupo', 'group', 'cerrar', 'abrir']
export default handler
