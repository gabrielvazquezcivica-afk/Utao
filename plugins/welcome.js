import fetch from 'node-fetch'
let WAMessageStubType = (await import('@whiskeysockets/baileys')).default

export async function before(m, { conn, groupMetadata }) {
  if (!m.isGroup || !m.messageStubType) return !0

  // URLs de audios
  let audioWelcome = 'https://d.uguu.se/woNwUdOC.mp3' // audio de bienvenida
  let audioBye = 'https://o.uguu.se/AGcyxnDN.mp3'      // audio de despedida

  let chat = global.db.data.chats[m.chat]
  if (!chat.welcome) return !0

  let participants = groupMetadata.participants.map(p => p.id)
  let userJid = (m.messageStubParameters?.[0] || '') + '@s.whatsapp.net'

  if (!participants.includes(userJid)) return !0

  // Intentar obtener nombre y foto
  let userName
  try {
    userName = await conn.getName(userJid)
  } catch {
    userName = '👻 Usuario desconocido'
  }

  let pp
  try {
    pp = await conn.profilePictureUrl(userJid, 'image')
  } catch {
    pp = 'https://telegra.ph/file/24fa902ead26340f3df2c.png'
  }

  // --- FUNCIONES AUXILIARES ---
  const mention = [userJid]
  const enviarAudio = async (url) => {
    await conn.sendMessage(m.chat, { audio: { url }, ptt: true, mimetype: 'audio/mpeg' }, { quoted: m })
  }

  // --- BIENVENIDA ---
  if (m.messageStubType === 27) {
    let texto = `
👀 *Nuevo integrante detectado...*
> Bienvenido/a @${userName.split(' ')[0]} 😈

🧩 _No esperes cariño, aquí sobrevivimos con sarcasmo y caos._  
📛 _Lee las reglas o no, total, igual te las vas a saltar._
`
    await conn.sendMessage(
      m.chat,
      {
        text: texto.trim(),
        contextInfo: {
          mentionedJid: mention,
          externalAdReply: {
            title: `😏 ¡Bienvenido/a al infierno!`,
            body: userName,
            thumbnailUrl: pp,
            sourceUrl: 'https://whatsapp.com',
            mediaType: 1,
            showAdAttribution: true
          }
        }
      }
    )
    await enviarAudio(audioWelcome)
  }

  // --- DESPEDIDA ---
  if (m.messageStubType === 28 || m.messageStubType === 32) {
    let texto = `
💀 *Un alma menos...*  
> Adiós @${userName.split(' ')[0]} 👋

🌪️ _Se fue sin despedirse, típico de los débiles._
🥀 _Otro que no aguantó el grupo..._
`
    await conn.sendMessage(
      m.chat,
      {
        text: texto.trim(),
        contextInfo: {
          mentionedJid: mention,
          externalAdReply: {
            title: `👋 Hasta nunca`,
            body: `${userName} fue eliminado del caos.`,
            thumbnailUrl: pp,
            sourceUrl: 'https://whatsapp.com',
            mediaType: 1,
            showAdAttribution: true
          }
        }
      }
    )
    await enviarAudio(audioBye)
  }

  return !0
}
