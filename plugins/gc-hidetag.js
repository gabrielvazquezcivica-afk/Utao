const handler = async (m, { conn, text, participants }) => {

  // Reacción 🚨
  await conn.sendMessage(m.chat, { react: { text: "🚨", key: m.key } });

  const users = participants.map(u => u.id);

  // Si no hay texto y no se respondió a nada
  if (!text && !m.quoted) {
    return conn.reply(m.chat, '*⚠️ Debes escribir un mensaje o responder a uno para usar este comando.*', m);
  }

  // Si hay texto y NO es respuesta a un mensaje → envía texto con hidetag
  if (text && !m.quoted) {
    return conn.sendMessage(
      m.chat,
      { text, mentions: users },
      { quoted: m }
    );
  }

  // Si SÍ está respondiendo a un mensaje
  if (m.quoted) {
    const q = m.quoted;
    const mime = q.mtype;

    // Reenviar exactamente el contenido del mensaje citado
    let msg = {};

    switch (mime) {

      case 'audioMessage':
        msg = {
          audio: await q.download(),
          ptt: q.ptt || false,
          mimetype: 'audio/mp4',
          mentions: users
        };
        break;

      case 'imageMessage':
        msg = {
          image: await q.download(),
          caption: q.text || text || '',
          mentions: users
        };
        break;

      case 'videoMessage':
        msg = {
          video: await q.download(),
          caption: q.text || text || '',
          mentions: users
        };
        break;

      case 'stickerMessage':
        msg = {
          sticker: await q.download(),
          mentions: users
        };
        break;

      default:
        msg = {
          text: q.text || text || '',
          mentions: users
        };
        break;
    }

    return conn.sendMessage(m.chat, msg, { quoted: m });
  }

};

handler.help = ['hidetag'];
handler.tags = ['group'];
handler.command = /^(hidetag|ht|n)$/i;
handler.group = true;
handler.admin = true;

export default handler;
