let handler = async (m, { conn, participants, isAdmin, isBotAdmin }) => {  
    if (!m.isGroup)  
        return m.reply('🎄❌ *Este regalo solo funciona en grupos navideños*')  
  
    if (!isAdmin)  
        return m.reply('🎅🚫 *Solo los elfos administradores pueden girar la ruleta*')  
  
    if (!isBotAdmin)  
        return m.reply('🤖🎄 *Necesito ser admin para repartir justicia navideña*')  
  
    // Filtrar usuarios que NO sean admins ni el bot  
    let members = participants  
        .filter(p => !p.admin)  
        .map(p => p.id)  
        .filter(id => id !== conn.user.jid)  
  
    if (members.length < 1)  
        return m.reply('🎁😔 *No hay renos disponibles para el sacrificio*')  
  
    // Elegir víctima aleatoria  
    let victim = members[Math.floor(Math.random() * members.length)]  
  
    // Reacción  
    await conn.sendMessage(m.chat, {  
        react: { text: '🎄', key: m.key }  
    })  
  
    // Mensaje dramático navideño  
    await conn.sendMessage(m.chat, {  
        text: `🎅🎰 *RULETA NAVIDEÑA DEL BAN* 🎰🎄\n\n❄️ El espíritu de la Navidad ha elegido a:\n🎁 @${victim.split('@')[0]}\n\n🚪✨ ¡HO HO HO… FUERA DEL GRUPO!`,  
        mentions: [victim]  
    })  
  
    // Espera corta para el suspenso  
    await new Promise(r => setTimeout(r, 1500))  
  
    // Sacar del grupo  
    await conn.groupParticipantsUpdate(m.chat, [victim], 'remove')  
}  
  
handler.help = ['ruletaban']  
handler.tags = ['group']  
handler.command = /^ruletaban$/i  
handler.group = true  
handler.admin = true  
handler.botAdmin = true  
  
export default handler
