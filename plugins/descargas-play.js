import fetch from "node-fetch";
import yts from "yt-search";
import axios from "axios";

/* ===============================
   AUDIO RÁPIDO SEGURO
================================ */
async function getFastAudio(url) {
  const res = await fetch(
    `https://api.stellarwa.xyz/dl/ytmp3?url=${encodeURIComponent(url)}&key=proyectsV2`
  ).then(r => r.json());

  if (!res?.data?.dl || typeof res.data.dl !== 'string') {
    throw new Error('Fast audio unavailable');
  }

  return res.data.dl;
}

/* ===============================
   PEQUEÑO DELAY (ANTI RATE)
================================ */
const sleep = ms => new Promise(r => setTimeout(r, ms));

/* ===============================
   HANDLER
================================ */
const handler = async (m, { conn, text, command }) => {
  try {
    if (!text) {
      return conn.reply(
        m.chat,
        "🎅 Dime qué canción quieres escuchar esta Navidad 🎄",
        m
      );
    }

    const search = await yts(text);
    if (!search.all.length) {
      return m.reply("☃️ No encontré esa canción bajo el árbol 🎶");
    }

    const v = search.all.find(x => x.ago) || search.all[0];
    const { title, thumbnail, timestamp, ago, url } = v;

    const thumb = (await conn.getFile(thumbnail)).data;

    const mensaje = `
🎄━━━━━━━━━━━━━━━━━━━━🎄
🎅 ${global.botname || conn.user?.name || 'CYBER-BOT'}
🎶 Preparando tu música navideña
━━━━━━━━━━━━━━━━━━━━━━

🎵 ${title}
⏱ ${timestamp}
🗓 ${ago}

🎁 Entregando tu regalo musical…
⛄━━━━━━━━━━━━━━━━━━━━⛄
`;

    await conn.reply(m.chat, mensaje, m, {
      contextInfo: {
        externalAdReply: {
          title: "🎄 Christmas Music Player",
          body: "⚡ Audio rápido",
          mediaType: 1,
          mediaUrl: url,
          sourceUrl: url,
          thumbnail: thumb,
          renderLargerThumbnail: true
        }
      }
    });

    // ⚡ SOLO UNA REACCIÓN (anti spam)
    await conn.sendMessage(m.chat, {
      react: { text: "⚡", key: m.key }
    });

    // ⏳ micro delay para WhatsApp
    await sleep(1200);

    let audioUrl;

    try {
      // 🚀 rápido
      audioUrl = await getFastAudio(url);
    } catch {
      // 🛟 respaldo
      const slow = await axios.get(
        `https://p.savenow.to/ajax/download.php?format=mp3&url=${encodeURIComponent(url)}`
      );
      audioUrl = slow?.data?.download_url;
    }

    if (!audioUrl) {
      return m.reply("❌ No pude preparar tu regalo musical 🎁");
    }

    // 🎶 AUDIO NORMAL (NO PTT)
    await conn.sendMessage(m.chat, {
      audio: { url: audioUrl },
      mimetype: 'audio/mpeg',
      ptt: false
    }, { quoted: m });

  } catch (err) {
    if (String(err).includes('rate-overlimit')) {
      return m.reply("⏳ Estoy enviando muchos regalos, intenta en unos segundos 🎄");
    }
    console.error(err);
    m.reply("❌ El duende se enredó con los cables 🎅");
  }
};

handler.command = handler.help = [
  'play','mp3','yta','ytmp3','playaudio'
];

handler.tags = ['downloader'];
export default handler;
