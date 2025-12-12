import axios from 'axios'
import { writeFileSync } from 'fs'
import { Sticker } from 'wa-sticker-formatter'

let handler = async (m, { conn, text }) => {
  if (!text) return m.reply('⚠️ !Ingresa el texto')

  try {
    await m.react('⏳')

    // API FUNCIONAL SIN ERRORES DNS
    const url = `https://api.akuari.my.id/canvas/quotemaker?text=${encodeURIComponent(text)}&author=HuTao-Bot`

    // Descargar imagen generada
    let res = await axios.get(url, { responseType: 'arraybuffer' })

    // Guardar temporalmente
    let imgPath = './tmp/qc.jpg'
    writeFileSync(imgPath, res.data)

    // Convertir a sticker
    let stiker = new Sticker(imgPath, {
      pack: "HuTao-Proyect",
      author: "🔥 Quotes",
      type: "full",
      categories: ["✨"],
      id: "qc-sticker",
    })

    const buffer = await stiker.toBuffer()

    // Enviar sticker ya convertido
    await conn.sendMessage(m.chat, { sticker: buffer }, { quoted: m })

    await m.react('✅')

  } catch (e) {
    console.log(e)
    await m.reply("❌ *No se pudo generar el sticker*\nIntenta de nuevo.")
    await m.react('✖️')
  }
}

handler.help = ['qc <texto>']
handler.tags = ['sticker']
handler.command = ['qc']

export default handler
