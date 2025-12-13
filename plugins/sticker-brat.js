// sticker-brat.js // Comando: .brat <texto> // Crea un sticker con el texto que escriba el usuario

import { createCanvas } from 'canvas'

let handler = async (m, { conn, text }) => { if (!text) throw '✏️ Escribe el texto para el sticker\nEjemplo: .brat Hola mundo'

// Ajustes del canvas const size = 512 const canvas = createCanvas(size, size) const ctx = canvas.getContext('2d')

// Fondo ctx.fillStyle = '#111111' ctx.fillRect(0, 0, size, size)

// Texto let fontSize = 64 ctx.fillStyle = '#ffffff' ctx.textAlign = 'center' ctx.textBaseline = 'middle'

// Ajustar tamaño del texto automáticamente do { ctx.font = bold ${fontSize}px Sans fontSize -= 2 } while (ctx.measureText(text).width > size - 40)

ctx.fillText(text, size / 2, size / 2, size - 40)

// Convertir a buffer const buffer = canvas.toBuffer('image/png')

// Enviar sticker await conn.sendMessage(m.chat, { sticker: buffer }, { quoted: m }) }

handler.help = ['brat <texto>'] handler.tags = ['sticker'] handler.command = /^brat$/i

export default handler
