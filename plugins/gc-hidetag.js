import { generateWAMessageFromContent } from '@whiskeysockets/baileys'

var handler = async (m, { conn, text, participants }) => {

let users = participants.map(u => conn.decodeJid(u.id))

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

// ================= FECHA + EMOJI POR MES
const meses = [
  { nombre: 'enero', emojis: ['❄️','🌨️','🧣'] },
  { nombre: 'febrero', emojis: ['❤️','🌹','❄️'] },
  { nombre: 'marzo', emojis: ['🌸','☘️','🌤️'] },
  { nombre: 'abril', emojis: ['🌼','🌦️','🐣'] },
  { nombre: 'mayo', emojis: ['🌺','☀️','🌷'] },
  { nombre: 'junio', emojis: ['🌞','😎','🏖️'] },
  { nombre: 'julio', emojis: ['🔥','🌴','☀️'] },
  { nombre: 'agosto', emojis: ['🌊','😎','🔥'] },
  { nombre: 'septiembre', emojis: ['🍂','🌾','🍁'] },
  { nombre: 'octubre', emojis: ['🎃','🍂','🕯️'] },
  { nombre: 'noviembre', emojis: ['🍁','🌫️','☕'] },
  { nombre: 'diciembre', emojis: ['❄️','🎄','🎁'] }
]

const now = new Date()
const dia = now.getDate()
const año = now.getFullYear()
const mesIndex = now.getMonth()
const mes = meses[mesIndex]
const emojiMes = mes.emojis[Math.floor(Math.random() * mes.emojis.length)]

// 🤖 Nombre del bot desde WhatsApp
let botName = conn.user?.name || 'Bot'

// 🧾 Footer
let footer = `\n\n> ${botName} | ${dia} de ${mes.nombre} ${emojiMes} ${año}`

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

handler.help = ['n']
handler.tags = ['grupo']
handler.command = ['n']
handler.admin = true

export default handler
