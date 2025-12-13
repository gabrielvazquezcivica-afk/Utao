// sticker-brat.js // Comando: .brat <texto> // Crea un sticker con el texto que escriba el usuario

import { createCanvas } from 'canvas'

let handler = async (m, { conn, text }) => { if (!text) throw '✏️ Escribe el texto para el sticker\nEjemplo: .brat Hola mundo'

const size = 512 const canvas = createCanvas(size, size) const ctx = canvas.getContext('2d')

// Fondo ctx.fillStyle = '#111111' ctx.fillRect(0, 0, size, size)

// Texto let fontSize = 80 ctx.fillStyle = '#ffffff' ctx.textAlign = 'center' ctx.textBaseline = 'middle'

// Autoajuste de texto while (fontSize > 20) { ctx.font = bold ${fontSize}px Sans if (ctx.measureText(text).width < size - 40) break fontSize -= 4 }

ctx.fillText(text, size / 2, size / 2, size - 40)

const buffer = canvas.toBuffer()

// Enviar como sticker (forma compatible con Baileys) await conn.sendImageAsSticker(m.chat, buffer, m, { packname: 'Brat Stickers', author: 'Bot' }) }

handler.help = ['brat <texto>']
handler.tags = ['sticker'] 
handler.command = ['brat']

export default handler
