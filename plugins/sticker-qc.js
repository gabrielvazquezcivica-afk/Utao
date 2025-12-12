import axios from 'axios';

let handler = async (m, { conn, text }) => {
  if (!text) return m.reply('⚠️ *Escribe un texto para generar la quote.*\n\nEjemplo:\n.qc Ánimo chicos 🌟');

  try {
    await m.react('⏳');

    let name = m.pushName || 'Anónimo';
    let avatar = await conn.profilePictureUrl(m.sender, 'image').catch(_ => 'https://telegra.ph/file/24fa902ead26340f3df2c.png');

    let url = `https://api.popcat.xyz/quote?author=${encodeURIComponent(name)}&image=${encodeURIComponent(avatar)}&text=${encodeURIComponent(text)}`;

    let res = await axios.get(url, { responseType: 'arraybuffer' });

    await conn.sendFile(m.chat, res.data, 'quote.png', '', m);
    await m.react('✅');

  } catch (err) {
    console.error(err);
    await m.reply('❌ *Error al generar la quote.*\nIntenta más tarde.');
    await m.react('✖️');
  }
};

handler.command = ['qc', 'quote'];
export default handler;
