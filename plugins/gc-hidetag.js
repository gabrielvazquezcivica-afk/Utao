const handler = async (m, { conn, text, participants }) => {

  // Reacción 🚨
  await conn.sendMessage(m.chat, { react: { text: "🚨", key: m.key } });

  const users = participants.map(u => u.id);

  // Obtener nombre del bot
  const botName = conn.getName(conn.user.jid);

  // Meses con emoji (puedes cambiar los emojis)
  const monthNames = [
    'Enero ❄️',
    'Febrero ❤️',
    'Marzo 🌱',
    'Abril 🌧️',
    'Mayo 🌼',
    'Junio ☀️',
    'Julio 🔥',
    'Agosto 🌞',
    'Septiembre 🍂',
    'Octubre 🎃',
    'Noviembre 🍁',
    'Diciembre 🎄'
  ];

  const date = new Date();
  const dayNum   = date.getDate();
  const monthTxt = monthNames[date.getMonth()];
  const year     = date.getFullYear();

  const finalDate = `${dayNum} de ${monthTxt} de ${year}`;

  const footer = `\n\n> ${botName} — ${finalDate}`;

  // Si no hay texto y no se respondió a nada
  if (!text && !m.quoted) {
    return conn.reply(
      m.chat,
      '*⚠️ Debes escribir un mensaje o responder a uno para usar este comando.*',
      m
    );
  }

  // Mandar texto si no es respuesta
  if (text && !m.quoted) {
    return conn.sendMessage(
      m.chat,
      {
        text: text + footer,
        mentions: users
      },
      { quoted: m }
    );
  }

  // Si está respondiendo
  if (m.quoted) {
    const q = m.quoted;
    const mime = q.mtype;

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
          caption: (q.text || text || '') + footer,
          mentions: users
        };
        break;

      case 'videoMessage':
        msg = {
          video: await q.download(),
          caption: (q.text || text || '') + footer,
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
          text: (q.text || text || '') + footer,
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
