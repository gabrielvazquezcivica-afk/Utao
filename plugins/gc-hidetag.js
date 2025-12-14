import { generateWAMessageFromContent } from '@whiskeysockets/baileys'

var handler = async (m, { conn, text, participants }) => {

let users = participants.map(u => conn.decodeJid(u.id))

if (!text && !m.quoted)
return conn.reply(m.chat, '🚩 Ingrese un texto o responda a un mensaje', m)

// Si responde a algo
let quoted = m.quoted ? m.quoted : null
let mime = quoted ? (quoted.msg || quoted).mimetype || '' : ''
let isMedia = quoted && /image|video|audio|sticker/.test(mime)

try {

if (isMedia) {
let media = await quoted.download()

// IMAGEN
if (/image/.test(mime)) {
return conn.sendMessage(
m.chat,
{ image: media, caption: text || '', mentions: users },
{ quoted: m }
)
}

// VIDEO
if (/video/.test(mime)) {
return conn.sendMessage(
m.chat,
{ video: media, caption: text || '', mentions: users },
{ quoted: m }
)
}

// AUDIO
if (/audio/.test(mime)) {
return conn.sendMessage(
m.chat,
{ audio: media, mimetype: mime },
{ quoted: m }
)
}

// STICKER
if (/sticker/.test(mime)) {
return conn.sendMessage(
m.chat,
{ sticker: media },
{ quoted: m }
)
}

} else {
// SOLO TEXTO
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

} catch (e) {
console.error(e)
}
}

handler.help = ['n']
handler.tags = ['grupo']
handler.command = ['n', 'hidetag', 'notify', 'tag']
handler.admin = true

export default handler
