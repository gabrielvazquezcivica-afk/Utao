let handler = async function (m, { conn }) {
  if (!m.isGroup || !m.messageStubType) return;

  let chat = global.db.data.chats[m.chat];
  if (!chat || !chat.welcome) return;

  let id = m.messageStubParameters?.[0];
  if (!id) return;

  let who = id + '@s.whatsapp.net';
  let mention = `@${id}`;

  // FRASES PESADAS 🔥
  const welcomes = [
    `🚨 ATENCIÓN 🚨 llegó alguien peligroso`,
    `🎭 Nuevo personaje tóxico desbloqueado`,
    `🔥 Agárrense, esto se va a poner feo`,
    `🤡 Entró el que nadie pidió`,
    `🧨 Alguien abrió la caja de Pandora`
  ];

  const byes = [
    `🚪 Se fue sin pagar la renta`,
    `💀 Abandonó la misión (cobarde)`,
    `🪦 Aquí yació, no duró nada`,
    `💨 Huyó antes del desastre`,
    `⚰️ Eliminado del servidor`
  ];

  let middleText =
    m.messageStubType === 27
      ? welcomes[Math.floor(Math.random() * welcomes.length)]
      : byes[Math.floor(Math.random() * byes.length)];

  let title = m.messageStubType === 27 ? '🔥 BIENVENIDO 🔥' : '💀 DESPEDIDA 💀';

  // CUADRO CON BORDES
  let box = `
╔════════════════════════════╗
║        ${title}        ║
╠════════════════════════════╣
║  ${middleText}
║
║  👤 ${mention}
╚════════════════════════════╝
`.trim();

  // FOTO DE PERFIL (usuario → bot)
  let pp;
  try {
    pp = await conn.profilePictureUrl(who, 'image');
  } catch {
    try {
      pp = await conn.profilePictureUrl(conn.user.jid, 'image');
    } catch {
      pp = null;
    }
  }

  // ENTRADA
  if (m.messageStubType === 27) {
    await conn.sendMessage(m.chat, {
      image: pp ? { url: pp } : undefined,
      caption: box,
      mentions: [who]
    });
  }

  // SALIDA / EXPULSIÓN
  if (m.messageStubType === 28 || m.messageStubType === 32) {
    await conn.sendMessage(m.chat, {
      image: pp ? { url: pp } : undefined,
      caption: box,
      mentions: [who]
    });
  }
};

handler.before = true;
export default handler;
