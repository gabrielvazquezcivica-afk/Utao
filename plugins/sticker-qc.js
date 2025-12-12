import axios from 'axios'

let handler = async (m, { conn, text }) => {
  if (!text) return m.reply('⚠️ *Escribe un texto para generar el quote*\nEjemplo:\n.qc Hola grupo')

  try {
    await m.react(rwait)

    let api = `https://vihangayt.me/api/quote?text=${encodeURIComponent(text)}&avatar=${encodeURIComponent(await getPp(conn, m.sender))}&name=${encodeURIComponent(conn.getName(m.sender))}`

    let res = await axios.get(api, { responseType: 'arraybuffer' })

    await conn.sendMessage(
      m.chat,
      { image: res.data, caption: '✨ Quote generado' },
      { quoted: m }
    )

    await m.react(done)

  } catch (e) {
    console.log(e)
    await m.react(error)
    m.reply('❌ No se pudo generar el QC. Intenta más tarde.')
  }
}

async function getPp(conn, who) {
  try {
    return await conn.profilePictureUrl(who, 'image')
  } catch {
    return 'https://telegra.ph/file/24fa902ead26340f3df2c.png'
  }
}

handler.command = ['qc', 'quote']
export default handler    )

    await m.react(done)

  } catch (e) {
    console.log(e)
    await m.react(error)
    return m.reply('❌ *Falló la API de Quotes*\nIntenta de nuevo más tarde.')
  }
}

handler.command = ['qc', 'quote']
export default handler
