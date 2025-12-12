import axios from 'axios'

let handler = async (m, { conn, text }) => {
  if (!text) return m.reply('⚠️ *Escribe un texto para generar el quote*\nEjemplo:\n.qc Hola grupo')

  let user = m.sender
  let name = conn.getName(user)

  // Foto de perfil
  let pp
  try {
    pp = await conn.profilePictureUrl(user, 'image')
  } catch {
    pp = 'https://telegra.ph/file/24fa902ead26340f3df2c.png'
  }

  try {
    await m.react(rwait)

    const body = {
      quote: text,
      author: name,
      avatar: pp
    }

    const res = await axios({
      method: 'POST',
      url: 'https://api.quotely.xyz/generate',
      data: body,
      responseType: 'arraybuffer'
    })

    await conn.sendMessage(
      m.chat,
      { image: res.data, caption: '✨ Quote generado' },
      { quoted: m }
    )

    await m.react(done)

  } catch (e) {
    console.log(e)
    await m.react(error)
    return m.reply('❌ *Falló la API de Quotes*\nIntenta de nuevo más tarde.')
  }
}

handler.command = ['qc', 'quote']
export default handler
