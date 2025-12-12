let linkRegex = /chat\.whatsapp\.com\/([0-9A-Za-z]{20,24})/i;
let linkRegex1 = /whatsapp\.com\/channel\/([0-9A-Za-z]{20,24})/i;

export async function before(m, { conn, isAdmin, isBotAdmin, isOwner, isROwner, participants }) {
if (!m.isGroup) return 
if (isAdmin || isOwner || m.fromMe || isROwner) return

let chat = global.db.data.chats[m.chat]
let delet = m.key.participant
let bang = m.key.id
const toUser = `@${m.sender.split`@`[0]}`

const isGroupLink = linkRegex.exec(m.text) || linkRegex1.exec(m.text)

if (chat.antiLink && isGroupLink) {

    if (isBotAdmin) {
        const linkThisGroup = `https://chat.whatsapp.com/${await conn.groupInviteCode(m.chat)}`
        if (m.text.includes(linkThisGroup)) return !0
    }

    await conn.reply(m.chat, `『✦』Se detectó un *enlace de grupo/canal*.\nMensaje eliminado de: ${toUser}`, {
        mentions: [m.sender]
    })

    if (isBotAdmin) {
        await conn.sendMessage(m.chat, { 
            delete: { remoteJid: m.chat, fromMe: false, id: bang, participant: delet }
        })
    }
}

return !0
}
