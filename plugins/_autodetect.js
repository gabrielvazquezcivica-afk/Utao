import baileys from '@whiskeysockets/baileys'
import fetch from 'node-fetch'

const { WAMessageStubType } = baileys

let handler = m => m

handler.before = async function (m, { conn, participants, groupMetadata }) {
  if (!m.isGroup || !m.messageStubType) return

  const chat = global.db.data.chats[m.chat]
  if (!chat?.detect) return

  const actor = m.sender
  const actorTag = `@${actor.split('@')[0]}`
  const target = m.messageStubParameters?.[0]
  const targetTag = target ? `@${target.split('@')[0]}` : ''
  const groupName = groupMetadata.subject

  const mentions = [actor]
  if (target) mentions.push(target)

  let text = ''

  // FOTO DEL BOT PARA THUMB
  let pp = await conn.profilePictureUrl(conn.user.jid).catch(() => global.imagen1)
  let img = await (await fetch(pp)).buffer()

  switch (m.messageStubType) {

    // 🔒 AJUSTES DEL GRUPO
    case WAMessageStubType.GROUP_CHANGE_RESTRICT:
      text = `⚙️ *Ajustes del grupo modificados*\n\n` +
             `📌 Ahora *${target === 'on' ? 'solo admins' : 'todos'}* pueden editar la info\n` +
             `👤 Hecho por: ${actorTag}`
      break

    // 🔕 ABRIR / CERRAR GRUPO
    case WAMessageStubType.GROUP_CHANGE_ANNOUNCE:
      text = `🔔 *Estado del grupo cambiado*\n\n` +
             `📌 El grupo fue *${target === 'on' ? 'cerrado 🔒' : 'abierto 🔓'}*\n` +
             `👤 Hecho por: ${actorTag}`
      break

    // 👑 DAR ADMIN
    case WAMessageStubType.GROUP_PARTICIPANT_PROMOTE:
      text = `👑 *Nuevo administrador*\n\n` +
             `✅ Usuario: ${targetTag}\n` +
             `👤 Otorgado por: ${actorTag}`
      break

    // ❌ QUITAR ADMIN
    case WAMessageStubType.GROUP_PARTICIPANT_DEMOTE:
      text = `❌ *Administrador removido*\n\n` +
             `👤 Usuario: ${targetTag}\n` +
             `📉 Quitado por: ${actorTag}`
      break

    // 🖼️ CAMBIO DE FOTO
    case WAMessageStubType.GROUP_CHANGE_ICON:
      text = `🖼️ *Foto del grupo actualizada*\n\n` +
             `👤 Cambiada por: ${actorTag}`
      break

    // ✏️ CAMBIO DE NOMBRE
    case WAMessageStubType.GROUP_CHANGE_SUBJECT:
      text = `✏️ *Nombre del grupo cambiado*\n\n` +
             `📛 Nuevo nombre: *${groupName}*\n` +
             `👤 Hecho por: ${actorTag}`
      break

    default:
      return
  }

  await conn.sendMessage(
    m.chat,
    {
      text,
      mentions,
      contextInfo: {
        mentionedJid: mentions,
        externalAdReply: {
          showAdAttribution: true,
          renderLargerThumbnail: true,
          title: global.packname || 'HuTao Bot',
          body: 'Detección de cambios del grupo',
          mediaType: 1,
          thumbnail: img,
          sourceUrl: channel
        }
      }
    }
  )
}

export default handler
