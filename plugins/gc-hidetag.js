import { generateWAMessageFromContent } from '@whiskeysockets/baileys'

var handler = async (m, { conn, text, participants }) => {

let users = participants.map(u => conn.decodeJid(u.id))

// Detectar media en el mismo mensaje o citado
let quoted = m.quoted || m
let mime = (quoted.msg || quoted).mimetype || ''
let isMedia = /image|video|audio|sticker/.test(mime)

// ❌ Si no hay texto ni media
if (!text && !isMedia) {
return conn.reply(
m.chat,
'✏️ Debes escribir un texto',
m
)
}

try {

// ================= STICKER
if (quoted.mtype === 'stickerMessage') {
let media = await quoted.download()
return conn.sendMessage(
m.chat,
{
sticker: media,
contextInfo: { mentionedJid: users }
},
{ quoted: m }
)
}

// ================= IMAGEN
if (/image/.test(mime)) {
let media = await quoted.download()
return conn.sendMessage(
m.chat,
{
image: media,
caption: text || '',
contextInfo: { mentionedJid: users }
},
{ quoted: m }
)
}

// ================= VIDEO
if (/video/.test(mime)) {
let media = await quoted.download()
return conn.sendMessage(
m.chat,
{
video: media,
caption: text || '',
contextInfo: { mentionedJid: users }
},
{ quoted: m }
)
}

// ================= AUDIO
if (/audio/.test(mime)) {
let media = await quoted.download()
return conn.sendMessage(
m.chat,
{
audio: media,
mimetype: mime,
contextInfo: { mentionedJid: users }
},
{ quoted: m }
)
}

// ================= SOLO TEXTO
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

} catch (e) {
console.error(e)
}
}

handler.help = ['n']
handler.tags = ['grupo']
handler.command = ['n']
handler.admin = true

export default handler
