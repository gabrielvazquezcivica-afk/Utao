import { createCanvas } from 'canvas'
import fs from 'fs'
import path from 'path'
import { sticker } from '../lib/sticker.js'

let handler = async (m, { conn, text }) => {
  let txt = text || m.quoted?.text
  if (!txt) return m.reply('✍️ Usa:\n.brat tamadre')

  // 🔥 Reacción
  await conn.sendMessage(m.chat, {
    react: { text: '🖤', key: m.key }
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
  let buffer = canvas.toBuffer()
  let stiker = await sticker(buffer, false, {
    pack: 'BRAT',
    author: 'Utao Bot'
  })

  // Guardar siempre el último
  let dir = './stickers'
  if (!fs.existsSync(dir)) fs.mkdirSync(dir)

  let file = path.join(dir, 'sticker-brat.webp')
  fs.writeFileSync(file, stiker)

  // Enviar
  await conn.sendMessage(m.chat, { sticker: stiker }, { quoted: m })
}

/* 🔑 ESTO ES LO QUE LO HACE FUNCIONAR */
handler.help = ['brat <texto>']
handler.tags = ['stickers']   // 👈 plural, como usa tu menú
handler.command = ['brat']    // 👈 forma compatible

export default handler
