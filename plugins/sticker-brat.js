console.log('✅ sticker-brat cargado')

import { createCanvas } from 'canvas'
import fs from 'fs'
import path from 'path'
import { sticker } from '../lib/sticker.js'

let handler = async (m, { conn, text }) => {
  let txt = text || m.quoted?.text
  if (!txt) return m.reply('✍️ Usa:\n.brat tamadre')

  await conn.sendMessage(m.chat, {
    react: { text: '🖤', key: m.key }
  })

  const size = 512
  const canvas = createCanvas(size, size)
  const ctx = canvas.getContext('2d')

  ctx.fillStyle = '#FFFFFF'
  ctx.fillRect(0, 0, size, size)

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

  let buffer = canvas.toBuffer()
  let stiker = await sticker(buffer, false, {
    pack: 'BRAT',
    author: 'Utao Bot'
  })

  if (!fs.existsSync('./stickers')) fs.mkdirSync('./stickers')
  fs.writeFileSync('./stickers/sticker-brat.webp', stiker)

  await conn.sendMessage(m.chat, { sticker: stiker }, { quoted: m })
}

/* 🔥 PROPS OBLIGATORIAS EN TU BASE */
handler.help = ['brat <texto>']
handler.command = ['brat']
handler.menu = 'stickers'

handler.private = false
handler.group = false
handler.limit = false
handler.admin = false
handler.botAdmin = false

export default handler
