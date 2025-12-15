const handler = async (m, { conn, participants, groupMetadata }) => {

const admins = participants.filter(p => p.admin)
const owner = groupMetadata.owner || admins[0]?.id

let text = `🎄 *INFO DEL GRUPO*
👥 Miembros: ${participants.length}
👑 Owner: @${owner.split('@')[0]}
`

conn.sendMessage(
m.chat,
{ text, mentions:[owner] },
{ quoted:m }
)
}

handler.command = ['infogrupo','gp']
handler.group = true
handler.admin = true

export default handler◈ *Delete:* ${antidelete ? '✅' : '❌'}
