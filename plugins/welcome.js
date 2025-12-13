let handler = async function (m, { conn }) {
  if (!m.isGroup || !m.messageStubType) return;

  let chat = global.db.data.chats[m.chat];
  if (!chat || !chat.welcome) return;

  let jid = m.messageStubParameters?.[0];
  if (!jid) return;

  // JID REAL (puede ser @lid o @s.whatsapp.net)
  let who = jid.includes('@') ? jid : jid + '@s.whatsapp.net';

  // Para mención visible
  let mention = '@' + who.split('@')[0];

  // FRASES PESADAS 😈
  const welcomes = [
    `🚨 ALERTA 🚨 llegó alguien peligroso`,
    `🔥 Nadie lo pidió, pero aquí está`,
    `🤡 Nuevo personaje tóxico desbloqueado`,
    `🧨 Esto se va a poner feo`,
    `🎭 Se sumó otro problema al grupo`
  ];

  const byes = [
    `🚪 Se fue sin despedirse`,
    `💀 Eliminado del servidor`,
    `🪦 No duró ni el tutorial`,
    `💨 Huyó antes del desastre`,
    `⚰️ Cayó un soldado`
  ];

  let middleText =
    m.messageStubType === 27
      ? welcomes[Math.floor(Math.random() * welcomes.length)]
      : byes[Math.floor(Math.random() * byes.length)];

  let title = m.messageStubType === 27 ? '🔥 BIENVENIDO 🔥' : '💀 DESPEDIDA 💀';

  // CUADRO
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
