import { areJidsSameUser } from '@whiskeysockets/baileys'

var handler = async (m, { conn, text, participants, args, command }) => {

let member = participants.map(u => u.id)
let sum = !text ? member.length : text
let total = 0
let sider = []

for (let i = 0; i < sum; i++) {
let users = m.isGroup ? participants.find(u => u.id == member[i]) : {}

if (
    (typeof global.db.data.users[member[i]] == 'undefined' ||
     global.db.data.users[member[i]]?.chat == 0) &&
    !users?.isAdmin &&
    !users?.isSuperAdmin
) {
    if (typeof global.db.data.users[member[i]] !== 'undefined') {
        if (global.db.data.users[member[i]]?.whitelist == false) {
            total++
            sider.push(member[i])
        }
    } else {
        total++
        sider.push(member[i])
    }
}
}

const delay = time => new Promise(res => setTimeout(res, time))

switch (command) {

case 'fantasmas': 
if (total == 0)
    return conn.reply(
        m.chat,
        `🎄✨ *¡Milagro Navideño!* ✨🎄\n\n🎅 Santa revisó la lista y...\n🎁 *Este grupo está activo, no hay fantasmas*`,
        m
    )

await m.reply(
`🎄🔔 *Revisión Navideña del Grupo* 🔔🎄

👻❄️ *Fantasmas detectados bajo el arbolito* ❄️👻
${sider.map(v => '@' + v.replace(/@.+/, '')).join('\n')}

📝 *Nota de Santa Bot:*  
🎅 El conteo inicia desde que el bot llegó al grupo,  
así que algunos fantasmitas solo están dormidos 😴🎄`,
null,
{ mentions: sider }
)
break

case 'kickfantasmas':  
if (total == 0)
    return conn.reply(
        m.chat,
        `🎄✨ *Grupo bendecido por Santa* ✨🎄\n\n🎁 No hay fantasmas que expulsar`,
        m
    )

await m.reply(
`🎄🚫 *Limpieza Navideña Activada* 🚫🎄

👻🎁 *Fantasmas que serán enviados al Polo Norte* ❄️
${sider.map(v => '@' + v.replace(/@.+/, '')).join('\n')}

⏳🎅 *Santa Bot expulsará a cada fantasma  
cada 10 segundos…*  
✨ ¡Para empezar el año con un grupo activo! ✨`,
null,
{ mentions: sider }
)

await delay(10 * 1000)

let chat = global.db.data.chats[m.chat]
chat.welcome = false

try {
let users = m.mentionedJid.filter(u => !areJidsSameUser(u, conn.user.id))

for (let user of users) {
    if (
        user.endsWith('@s.whatsapp.net') &&
        !(participants.find(v => areJidsSameUser(v.id, user)) || { admin: true }).admin
    ) {
        await conn.groupParticipantsUpdate(m.chat, [user], 'remove')
        await delay(10 * 1000)
    }
}
} finally {
chat.welcome = true
}
break
}
}

handler.tags = ['grupo']
handler.command = ['fantasmas', 'kickfantasmas']
handler.group = true
handler.botAdmin = true
handler.admin = true
handler.fail = null

export default handler
