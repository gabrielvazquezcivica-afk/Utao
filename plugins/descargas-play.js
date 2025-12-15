import fetch from "node-fetch";
import yts from "yt-search";
import axios from "axios";

/* ===============================
   UTILIDADES
================================ */
const sleep = ms => new Promise(r => setTimeout(r, ms));

async function getFastAudio(url) {
  const res = await fetch(
    `https://api.stellarwa.xyz/dl/ytmp3?url=${encodeURIComponent(url)}&key=proyectsV2`
  ).then(r => r.json());

  if (!res?.data?.dl || typeof res.data.dl !== 'string') {
    throw new Error('Fast API failed');
  }

  return res.data.dl;
}

async function getSafeAudio(url) {
  const start = await axios.get(
    `https://p.savenow.to/ajax/download.php?format=mp3&url=${encodeURIComponent(url)}`
  );

  if (!start.data?.success || !start.data?.id) {
    throw new Error('SaveNow init failed');
  }

  const id = start.data.id;

  // ⏳ esperar progreso REAL
  for (let i = 0; i < 20; i++) {
    const r = await axios.get(
      `https://p.savenow.to/ajax/progress?id=${id}`
    );

    if (r.data?.success && r.data?.download_url) {
      return r.data.download_url;
    }

    await sleep(2000);
  }

  throw new Error('SaveNow timeout');
}

/* ===============================
   HANDLER
================================ */
const handler = async (m, { conn, text, command }) => {
  try {
    if (!text)
      return m.reply("🎅 Dime qué canción quieres escuchar 🎄");

    const search = await yts(text);
    if (!search.all.length)
      return m.reply("☃️ No encontré esa canción");

    const v = search.all.find(x => x.ago) || search.all[0];
    const { title, thumbnail, timestamp, ago, url } = v;

    const thumb = (await conn.getFile(thumbnail)).data;

    const mensaje = `
🎄━━━━━━━━━━━━━━━━━━━━🎄
🎅 ${global.botname || 'HUTAO-BOT'}
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
          body: "⚡ Audio rápido y estable",
          mediaType: 1,
          mediaUrl: url,
          sourceUrl: url,
          thumbnail: thumb,
          renderLargerThumbnail: true
        }
      }
    });

    // una sola reacción
    await conn.sendMessage(m.chat, {
      react: { text: "⚡", key: m.key }
    });

    await sleep(1200);

    let audioUrl;

    try {
      // 🚀 rápido
      audioUrl = await getFastAudio(url);
    } catch {
      // 🛟 seguro
      audioUrl = await getSafeAudio(url);
    }

    await conn.sendMessage(m.chat, {
      audio: { url: audioUrl },
      mimetype: 'audio/mpeg',
      ptt: false
    }, { quoted: m });

  } catch (e) {
    console.error(e);
    m.reply("❌ No pude preparar tu regalo musical 🎁");
  }
};

handler.command = [
  'play','mp3','yta','ytmp3','playaudio'
];
handler.tags = ['downloader'];
export default handler;
