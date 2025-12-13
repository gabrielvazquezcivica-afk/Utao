let handler = async (m, { conn, participants, action }) => {
  // ESTE ARCHIVO NO USA handler normal
}

handler.before = async function (m, { conn, participants, action }) {
  // 🔒 switch global welcome ON/OFF
  let chat = global.db.data.chats[m.chat]
  if (!chat || !chat.welcome) return

  let user = participants[0]
  let group = await conn.groupMetadata(m.chat)
  let groupName = group.subject
  let members = group.participants.length

  let pp = 'https://i.imgur.com/2wzGhpF.png'
  try {
    pp = await conn.profilePictureUrl(user, 'image')
  } catch {}

  // 🔥 BIENVENIDA AGRESIVA
  if (action === 'add') {
    let txt = `
💀 @${user.split('@')[0]}
Entraste a *${groupName}*

👥 ${members} dentro.
🩸 Aguanta o desaparece.
`
    await conn.sendMessage(m.chat, {
      image: { url: pp },
      caption: txt,
      mentions: [user]
    })
  }

  // ☠️ DESPEDIDA AGRESIVA
  if (action === 'remove') {
    let txt = `
⚰️ @${user.split('@')[0]}
Fuera de *${groupName}*

🚪 Caso cerrado.
`
    await conn.sendMessage(m.chat, {
      image: { url: pp },
      caption: txt,
      mentions: [user]
    })
  }
}

export default handler
