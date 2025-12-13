import { createCanvas } from 'canvas'
import { sticker } from '../lib/sticker.js'
import fs from 'fs'
import path from 'path'

let handler = async (m, { conn, text }) => {
  let txt = text || m.quoted?.text
  if (!txt) return m.reply('✍️ Usa:\n.brat tamadre')

  // 🔥 Reacción
  await conn.sendMessage(m.chat, {
    react: { text: '🎭', key: m.key }
  })

  txt = txt.slice(0, 50)

  const size = 512
  const canvas = createCanvas(size, size)
  const ctx = canvas.getContext('2d')

  // Fondo blanco
  ctx.fillStyle = '#FFFFFF'
  ctx.fillRect(0, 0, size, size)

  // Texto negro
  ctx.fillStyle = '#000000'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'

  let fontSize = 90
  ctx.font = `bold ${fontSize}px Arial`
  while (ctx.measureText(txt).width > 460) {
    fontSize -= 5
    ctx.font = `bold ${fontSize}px Arial`
  }

  ctx.fillText(txt, size / 2, size / 2)

  // Crear sticker
  let imgBuffer = canvas.toBuffer()
  let stiker = await sticker(imgBuffer, false, {
    pack: 'BRAT',
    author: 'Utao Bot'
  })

  // 📁 Carpeta stickers
  let dir = './stickers'
  if (!fs.existsSync(dir)) fs.mkdirSync(dir)

  // 💾 Archivo fijo
  let filePath = path.join(dir, 'sticker-brat.webp')
  fs.writeFileSync(filePath, stiker)

  // 📤 Enviar
  await conn.sendMessage(m.chat, { sticker: stiker }, { quoted: m })
}

handler.help = ['brat <texto>']
handler.tags = ['sticker']
handler.command = /^brat$/i

export default handler
