import { generateWAMessageFromContent } from '@whiskeysockets/baileys'

var handler = async (m, { conn, text, participants }) => {

let users = participants.map(u => conn.decodeJid(u.id))

// 📅 Fecha
let fecha = new Date().toLocaleDateString('es-MX', {
day: '2-digit',
month: '2-digit',
year: 'numeric'
})

// 🤖 Nombre del bot desde WhatsApp
let botName = conn.user?.name || 'Bot'

// 🧾 Footer final
let footer = `\n\n> ${botName} | ${fecha}`

// ❌ Aviso si no mandan nada
if (!text && !m.quoted) {
return conn.reply(
m.chat,
'✏️ Debes escribir un texto o responder a un mensaje',
m
)
}

// ❄️ Reacción
await conn.sendMessage(m.chat, {
react: {
text: '⛄',
key: m.key
}
})

// ================= SI ESTÁ RESPONDIENDO
if (m.quoted) {
const q = m.quoted
const mime = q.mtype

let msg = {}

switch (mime) {

case 'audioMessage':
msg = {
audio: await q.download(),
ptt: q.ptt || false,
mimetype: 'audio/mp4',
mentions: users
}
break

case 'imageMessage':
msg = {
image: await q.download(),
caption: (q.text || text || '') + footer,
mentions: users
}
break

case 'videoMessage':
msg = {
video: await q.download(),
caption: (q.text || text || '') + footer,
mentions: users
}
break

case 'stickerMessage':
msg = {
sticker: await q.download(),
mentions: users
}
break

default:
msg = {
text: (q.text || text || '') + footer,
mentions: users
}
break
}

return conn.sendMessage(m.chat, msg, { quoted: m })
}

// ================= SOLO TEXTO
let msg = generateWAMessageFromContent(
m.chat,
{
extendedTextMessage: {
text: text + footer,
contextInfo: {
mentionedJid: users
}
}
},
{ quoted: m, userJid: conn.user.id }
)

await conn.relayMessage(
m.chat,
msg.message,
{ messageId: msg.key.id }
)

}

handler.help = ['hidetag']
handler.tags = ['grupo']
handler.command = ['n', 'hidetag', 'tag']
handler.admin = true

export default handler
