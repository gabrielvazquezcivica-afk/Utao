import fetch from 'node-fetch'  
const isLinkTik = /tiktok.com/i 
const isLinkYt = /youtube.com|youtu.be/i 
const isLinkTel = /telegram.com/i 
const isLinkFb = /facebook.com|fb.me/i 
const isLinkIg = /instagram.com/i 
const isLinkTw = /twitter.com/i 
  
let handler = m => m
handler.before = async function (m, { conn, args, usedPrefix, command, isAdmin, isBotAdmin }) {

if (m.isBaileys && m.fromMe) return !0
if (!m.isGroup) return !1

let chat = global.db.data.chats[m.chat]
let delet = m.key.participant
let bang = m.key.id
let toUser = `${m.sender.split("@")[0]}`
let aa = toUser + '@s.whatsapp.net'

const isAntiLinkTik = isLinkTik.exec(m.text)
const isAntiLinkYt = isLinkYt.exec(m.text)
const isAntiLinkTel = isLinkTel.exec(m.text)
const isAntiLinkFb = isLinkFb.exec(m.text)
const isAntiLinkIg = isLinkIg.exec(m.text)
const isAntiLinkTw = isLinkTw.exec(m.text)

async function warnAndDelete(type) {
    await conn.reply(
        m.chat,
        `🎄✨ *Ho ho ho~* ✨🎄\n\n❄️ Se detectó un enlace navideño de *${type}*.\n🧑‍🎄 Mensaje eliminado de: *@${toUser}*\n\n🎁 *Comparte solo alegría esta Navidad*`,
        null,
        { mentions: [aa] }
    )
    await conn.sendMessage(m.chat, { 
        delete: { remoteJid: m.chat, fromMe: false, id: bang, participant: delet }
    })
}

if (chat.antiTiktok && isAntiLinkTik) await warnAndDelete("TikTok")
if (chat.antiYoutube && isAntiLinkYt) await warnAndDelete("YouTube")
if (chat.antiTelegram && isAntiLinkTel) await warnAndDelete("Telegram")
if (chat.antiFacebook && isAntiLinkFb) await warnAndDelete("Facebook")
if (chat.antiInstagram && isAntiLinkIg) await warnAndDelete("Instagram")
if (chat.antiTwitter && isAntiLinkTw) await warnAndDelete("Twitter")

return !0
}
export default handler
