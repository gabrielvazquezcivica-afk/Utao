// code traído por Xi_Crew (modificado)
// Reply visible al ejecutor del comando

import { generateWAMessageFromContent } from '@whiskeysockets/baileys'
import * as fs from 'fs'

var handler = async (m, { conn, text, participants }) => {

if (!m.quoted && !text) 
return conn.reply(m.chat, `🚩 Ingrese un texto`, m)

try {

let users = participants.map(u => conn.decodeJid(u.id))
let q = m.quoted ? m.quoted : m
let c = m.quoted ? await m.getQuotedObj() : m.msg

let msg = conn.cMod(
m.chat,
generateWAMessageFromContent(
m.chat,
{
[m.quoted ? q.mtype : 'extendedTextMessage']:
m.quoted ? c.message[q.mtype] : { text: '' }
},
{ quoted: m, userJid: conn.user.id }
),
text || q.text,
conn.user.jid,
{ mentions: users }
)

await conn.relayMessage(
m.chat,
msg.message,
{ messageId: msg.key.id }
)

} catch {

let users = participants.map(u => conn.decodeJid(u.id))
let quoted = m.quoted ? m.quoted : m
let mime = (quoted.msg || quoted).mimetype || ''
let isMedia = /image|video|sticker|audio/.test(mime)

let more = String.fromCharCode(8206)
let masss = more.repeat(850)
let htextos = text ? text : '*Hola!!*'

if (isMedia && quoted.mtype === 'imageMessage') {
let media = await quoted.download()
return conn.sendMessage(
m.chat,
{ image: media, caption: htextos, mentions: users },
{ quoted: m }
)

} else if (isMedia && quoted.mtype === 'videoMessage') {
let media = await quoted.download()
return conn.sendMessage(
m.chat,
{ video: media, mimetype: 'video/mp4', caption: htextos, mentions: users },
{ quoted: m }
)

} else if (isMedia && quoted.mtype === 'audioMessage') {
let media = await quoted.download()
return conn.sendMessage(
m.chat,
{ audio: media, mimetype: 'audio/mp4', fileName: 'Hidetag.mp3' },
{ quoted: m }
)

} else if (isMedia && quoted.mtype === 'stickerMessage') {
let media = await quoted.download()
return conn.sendMessage(
m.chat,
{ sticker: media, mentions: users },
{ quoted: m }
)

} else {
return conn.relayMessage(
m.chat,
{
extendedTextMessage: {
text: `${masss}\n${htextos}\n`,
contextInfo: {
mentionedJid: users
}
}
},
{ quoted: m }
)
}

}
}

handler.help = ['hidetag']
handler.tags = ['grupo']
handler.command = ['hidetag', 'notificar', 'notify', 'tag', 'n']
handler.admin = true

export default handler
