let handler = async (m, { conn, args, usedPrefix, command }) => {
const pp = await conn.profilePictureUrl(m.chat, 'image').catch(_ => icons) 

let isClose = { // Switch Case Like :v
'open': 'not_announcement',
'close': 'announcement',
'abierto': 'not_announcement',
'cerrado': 'announcement',
'abrir': 'not_announcement',
'cerrar': 'announcement',
}[(args[0] || '')]

if (isClose === undefined)
return conn.reply(
m.chat,
`🎄 *CONFIGURACIÓN NAVIDEÑA DEL GRUPO* 🎅✨

⛄ Elige una opción:

🎁 *Ejemplos:*
❄️ *${usedPrefix + command} abrir*
🔔 *${usedPrefix + command} cerrar*
🎄 *${usedPrefix + command} bloquear*
🎅 *${usedPrefix + command} desbloquear*

✨ ¡Que la magia de la Navidad reine en el grupo!*`,
m,
rcanal
)

await conn.groupSettingUpdate(m.chat, isClose)

if (isClose === 'not_announcement'){
m.reply(`🔓🎄 *¡EL GRUPO SE ABRE!*
✨ Todos pueden escribir nuevamente
🎅 Ho ho ho, ¡felices mensajes!`)
}

if (isClose === 'announcement'){
m.reply(`🔐🎄 *MODO NAVIDEÑO ACTIVADO*
❄️ Solo los *admins* pueden escribir
🎁 El orden mantiene la magia ✨`)
}}

handler.help = ['group open / close', 'grupo abrir / cerrar']
handler.tags = ['grupo']
handler.command = ['group', 'grupo']
handler.admin = true
handler.botAdmin = true

export default handler
