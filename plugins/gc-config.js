let handler = async (m, { conn, args, command, isAdmin }) => {  

  if (!isAdmin)
    return m.reply('🎄❌ *Ho ho ho…* Solo los **elfos administradores** pueden abrir o cerrar el taller 🎅✨')

  let isClose = {  
    'open': 'not_announcement',  
    'abrir': 'not_announcement',  
    'close': 'announcement',  
    'cerrar': 'announcement'  
  }[(args[0] || command)]  

  if (!isClose) return  

  // 🔖 marcar que viene de comando  
  conn._groupCmd = conn._groupCmd || {}  
  conn._groupCmd[m.chat] = Date.now()  

  await conn.groupSettingUpdate(m.chat, isClose)  

  // 👉 solo reacción  
  await conn.sendMessage(m.chat, {  
    react: {  
      text: isClose === 'announcement' ? '🔐🎄' : '🔓🎄',  
      key: m.key  
    }  
  })  
}  

handler.command = ['group', 'grupo', 'abrir', 'cerrar']  
handler.admin = true  
handler.botAdmin = true  

export default handler
