import axios from 'axios'

let handler = async (m, { conn, text }) => {
  if (!text) return m.reply('⚠️ *Ingresa el texto')
  
  try {
    await m.react('⏳')

    const payload = {
      quote: text,
      author: "HuTao-Bot",
      avatar: "https://telegra.ph/file/24fa902ead26340f3df2c.png"
    }

    let res = await axios.post("https://api.quotely.xyz/generate", payload, {
      responseType: "arraybuffer"
    })

    await conn.sendFile(m.chat, res.data, "quote.png", "", m)
    await m.react('✅')

  } catch (e) {
    console.log(e)
    m.reply("❌ *Falló la API de Quotes*\nIntenta más tarde.")
    await m.react('✖️')
  }
}

handler.help = ['qc <texto>']
handler.tags = ['sticker']
handler.command = ['qc']

export default handler
