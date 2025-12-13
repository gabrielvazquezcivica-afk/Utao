let handler = async (m, { conn, participants, isAdmin, isBotAdmin }) => {
    if (!m.isGroup)
        return m.reply('❌ Este comando solo funciona en grupos')

    if (!isAdmin)
        return m.reply('❌ Solo los admins pueden usar la ruleta')

    if (!isBotAdmin)
        return m.reply('❌ Necesito ser admin para ejecutar la ruleta')

    // Filtrar usuarios que NO sean admins ni el bot
    let members = participants
        .filter(p => !p.admin)
        .map(p => p.id)
        .filter(id => id !== conn.user.jid)

    if (members.length < 1)
        return m.reply('⚠️ No hay víctimas disponibles 😔')

    // Elegir víctima aleatoria
    let victim = members[Math.floor(Math.random() * members.length)]

    // Reacción
    await conn.sendMessage(m.chat, {
        react: { text: '🎯', key: m.key }
    })

    // Mensaje dramático
    await conn.sendMessage(m.chat, {
        text: `🎰 *RUELTA DEL BAN* 🎰\n\n💀 El desafortunado es:\n@${victim.split('@')[0]}\n\n🚪 ¡FUERA DEL GRUPO!`,
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
