import { addExif } from '../lib/sticker.js'

let handler = async (m, { conn, text }) => {
  // Validar respuesta a sticker
  if (!m.quoted || !/sticker/.test(m.quoted.mtype))
    return m.reply('⚠️ *Responde a un sticker*')

  if (!text)
    return m.reply('⚠️ *Escribe el pack y/o autor*\n\nEjemplo:\n.wm MiPack|Gabriel')

  try {
    await m.react(rwait)

    let [packname, ...author] = text.split('|')
    author = (author || []).join('|')

    // Validar mimetype
    let mime = m.quoted.mimetype || ''
    if (!/webp/.test(mime)) return m.reply('⚠️ *Solo stickers webp*')

    // Descargar sticker
    let img = await m.quoted.download()
    if (!img) return m.reply('⚠️ *No pude descargar el sticker*')

    // Convertir con Exif
    let stiker = await addExif(img, packname || '', author || '')

    // Enviar resultado
    await conn.sendFile(m.chat, stiker, 'wm.webp', '', m)
    await m.react(done)

  } catch (e) {
    console.error(e)
    await m.react(error)
    return m.reply('❌ *No se pudo convertir tu sticker*\nVerifica que sea un sticker válido.')
  }
}

handler.help = ['take *<nombre>|<autor>*']
handler.tags = ['sticker']
handler.command = ['take', 'robar', 'wm']

export default handler
