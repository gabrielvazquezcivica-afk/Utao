import fetch from 'node-fetch'

export async function before(m, { conn }) {
  if (!m.messageStubType || !m.isGroup) return true;

  let chat = global.db.data.chats[m.chat];

  // AUDIOS
  let audioWelcome = 'https://d.uguu.se/woNwUdOC.mp3'; // Bienvenida
  let audioBye = 'https://o.uguu.se/AGcyxnDN.mp3';     // Despedida

  // OBTENER JID DEL USUARIO
  let userJid = m.messageStubParameters[0] + '@s.whatsapp.net';

  // FOTO DE PERFIL DEL USUARIO O LA DEL BOT
  let ppUser;
  try { 
    ppUser = await conn.profilePictureUrl(userJid, 'image');
  } catch {
    ppUser = await conn.profilePictureUrl(conn.user.jid, 'image'); // fallback
  }

  // NOMBRE
  let name = await conn.getName(userJid);

  // LISTA DE MENSAJES ALEATORIOS (CRUELES EXTREMOS)
  const welcomeMessages = [
    `🩸 *Alguien se perdió y cayó aquí* 🩸\nBienvenido *${name}*, aunque nadie te pidió.`,
    `🔥 *Nuevo inútil detectado* 🔥\n*${name}* entró… qué desgracia para el grupo.`,
    `👹 *Otro alma condenada llegó* 👹\nSiéntete como en casa, aunque no te queramos, *${name}*.`,
    `🕳️ *Apareció un NPC* 🕳️\nHola *${name}*, trata de no hacer el ridículo… aunque lo dudo.`,
    `💀 *Respiren hondo… llegó otro estorbo* 💀\nBienvenido *${name}*, intenta no fallar… pero sabemos que lo harás.`
  ];

  const byeMessages = [
    `⚰️ *Gracias al cielo* ⚰️\n*${name}* se fue. El grupo mejora automáticamente.`,
    `🗑️ *Un desecho menos* 🗑️\nAdiós *${name}*, tu ausencia es un regalo.`,
    `👋 *Por fin se largó* 👋\nVete tranquilo *${name}*, nadie te detiene.`,
    `🔥 *Se evaporó el estorbo* 🔥\nEl universo agradece que *${name}* haya salido.`,
    `😮‍💨 *Qué alivio* 😮‍💨\n*${name}* dejó el grupo… ya hacía falta limpieza.`
  ];

  // SELECCIONAR UNO AL AZAR
  const pickRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];

  // BIENVENIDA (STUB 27)
  if (chat.welcome && m.messageStubType === 27) {
    await conn.sendMessage(m.chat, {
      text: pickRandom(welcomeMessages),
      contextInfo: {
        mentionedJid: [userJid],
        externalAdReply: {
          title: "🩸 Bienvenido al Infierno 🩸",
          body: name,
          thumbnailUrl: ppUser,
          mediaType: 1,
          showAdAttribution: true
        }
      }
    });

    await conn.sendMessage(m.chat, {
      audio: { url: audioWelcome },
      ptt: true,
      mimetype: 'audio/mpeg'
    });
  }

  // DESPEDIDA (STUB 28 / 32)
  if (chat.welcome && (m.messageStubType === 28 || m.messageStubType === 32)) {
    await conn.sendMessage(m.chat, {
      text: pickRandom(byeMessages),
      contextInfo: {
        mentionedJid: [userJid],
        externalAdReply: {
          title: "⚰️ Adiós Basura ⚰️",
          body: `${name} salió del grupo`,
          thumbnailUrl: ppUser,
          mediaType: 1,
          showAdAttribution: true
        }
      }
    });

    await conn.sendMessage(m.chat, {
      audio: { url: audioBye },
      ptt: true,
      mimetype: 'audio/mpeg'
    });
  }

  return true;
          }
