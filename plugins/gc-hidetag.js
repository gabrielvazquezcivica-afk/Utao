import { generateWAMessageFromContent } from '@whiskeysockets/baileys'

var handler = async (m, { conn, text, participants }) => {

let users = participants.map(u => conn.decodeJid(u.id))
let footer = '' // déjalo vacío si no quieres nada extra

// ❌ Si no manda texto ni responde a algo
if (!text && !m.quoted) {
return conn.reply(
m.chat,
'✏️ Debes escribir un texto o responder a un mensaje',
m
)
}

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

// ================= SOLO TEXTO (SIN QUOTED)
let msg = generateWAMessageFromContent(
m.chat,
{
extendedTextMessage: {
text: text,
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

handler.help = ['n']
handler.tags = ['grupo']
handler.command = ['n']
handler.admin = true

export default handler
