import { generateWAMessageFromContent } from '@whiskeysockets/baileys'

var handler = async (m, { conn, text, participants }) => {

let users = participants.map(u => conn.decodeJid(u.id))

if (!text && !m.quoted)
return conn.reply(m.chat, '🚩 Ingrese un texto o responda a un mensaje', m)

let quoted = m.quoted
let mime = quoted ? (quoted.msg || quoted).mimetype || '' : ''

try {

// ================= SI HAY MENSAJE RESPONDIDO
if (quoted) {
let media = await quoted.download()

// STICKER
if (quoted.mtype === 'stickerMessage') {
return conn.sendMessage(
m.chat,
{
sticker: media,
contextInfo: { mentionedJid: users }
},
{ quoted: m }
)
}

// IMAGEN
if (/image/.test(mime)) {
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

// VIDEO
if (/video/.test(mime)) {
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

// AUDIO
if (/audio/.test(mime)) {
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
handler.command = ['n', 'hidetag', 'notify', 'tag']
handler.admin = true

export default handler
