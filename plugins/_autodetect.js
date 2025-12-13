import baileys from '@whiskeysockets/baileys'
const { WAMessageStubType } = baileys

let handler = m => m

handler.before = async function (m, { conn, groupMetadata }) {
  if (!m.isGroup || !m.messageStubType) return

  const chat = global.db.data.chats[m.chat]
  if (!chat?.detect) return

  const actor = m.sender
  const actorTag = `@${actor.split('@')[0]}`
  const target = m.messageStubParameters?.[0]
  const targetTag = target ? `@${target.split('@')[0]}` : ''

  let text = ''
  let mentions = [actor]
  if (target) mentions.push(target)

  switch (m.messageStubType) {

    // 🔔 ABRIR / CERRAR GRUPO
    case WAMessageStubType.GROUP_CHANGE_ANNOUNCE: {
      const isClose = target === 'on'
      text =
`🚩 El grupo ha sido ${isClose ? 'cerrado' : 'abierto'}
${isClose ? 'solo admins pueden enviar mensajes' : 'todos pueden enviar mensajes'}

👤 Por: ${actorTag}`
      break
    }

    // ⚙️ AJUSTES DEL GRUPO
    case WAMessageStubType.GROUP_CHANGE_RESTRICT: {
      text =
`⚙️ Ajustes del grupo modificados
${target === 'on' ? 'solo admins pueden editar la información' : 'todos pueden editar la información'}

👤 Por: ${actorTag}`
      break
    }

    // 👑 DAR ADMIN
    case WAMessageStubType.GROUP_PARTICIPANT_PROMOTE: {
      text =
`👑 Nuevo administrador
${targetTag}

👤 Otorgado por: ${actorTag}`
      break
    }

    // ❌ QUITAR ADMIN
    case WAMessageStubType.GROUP_PARTICIPANT_DEMOTE: {
      text =
`❌ Administrador removido
${targetTag}

👤 Quitado por: ${actorTag}`
      break
    }

    // ✏️ CAMBIO DE NOMBRE
    case WAMessageStubType.GROUP_CHANGE_SUBJECT: {
      text =
`✏️ Nombre del grupo cambiado
Nuevo nombre: *${groupMetadata.subject}*

👤 Por: ${actorTag}`
      break
    }

    // 🖼️ CAMBIO DE FOTO
    case WAMessageStubType.GROUP_CHANGE_ICON: {
      text =
`🖼️ Foto del grupo actualizada

👤 Por: ${actorTag}`
      break
    }

    default:
      return
  }

  // 🧹 BORRAR MENSAJE REAL DEL SISTEMA (opcional)
  try {
    await conn.sendMessage(m.chat, { delete: m.key })
  } catch {}

  // 📢 ENVIAR AVISO TIPO SISTEMA
  await conn.sendMessage(m.chat, {
    text,
    mentions
  })
}

export default handler
