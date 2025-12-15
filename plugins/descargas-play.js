import fetch from "node-fetch";
import yts from "yt-search";
import axios from "axios";

const sleep = ms => new Promise(r => setTimeout(r, ms));

async function getFastAudio(url) {
  const res = await fetch(
    `https://api.stellarwa.xyz/dl/ytmp3?url=${encodeURIComponent(url)}&key=proyectsV2`
  ).then(r => r.json());

  if (!res?.data?.dl) throw new Error();
  return res.data.dl;
}

async function getQuickBackup(url, timeout = 15000) {
  const start = Date.now();

  const init = await axios.get(
    `https://p.savenow.to/ajax/download.php?format=mp3&url=${encodeURIComponent(url)}`
  );

  if (!init.data?.id) throw new Error();

  while (Date.now() - start < timeout) {
    const r = await axios.get(
      `https://p.savenow.to/ajax/progress?id=${init.data.id}`
    );

    if (r.data?.download_url) {
      return r.data.download_url;
    }

    await sleep(2000);
  }

  throw new Error('Timeout');
}

const handler = async (m, { conn, text, command }) => {
  try {
    if (!text) return m.reply("🎄 Escribe una canción");

    const search = await yts(text);
    if (!search.all.length) return m.reply("☃️ No encontrada");

    const v = search.all.find(x => x.ago) || search.all[0];
    const { title, thumbnail, timestamp, ago, url } = v;
    const thumb = (await conn.getFile(thumbnail)).data;

    await conn.reply(m.chat, `
🎄 ${global.botname || 'HUTAO-BOT'}
🎶 Preparando tu música
🎵 ${title}
⏱ ${timestamp}
`, m, {
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

    await conn.sendMessage(m.chat, {
      react: { text: "⚡", key: m.key }
    });

    let audioUrl;

    try {
      // 🚀 INSTANTÁNEO
      audioUrl = await getFastAudio(url);
    } catch {
      // ⏱ RESPALDO RÁPIDO (15s máx)
      audioUrl = await getQuickBackup(url);
    }

    await conn.sendMessage(m.chat, {
      audio: { url: audioUrl },
      mimetype: 'audio/mpeg',
      ptt: false
    }, { quoted: m });

  } catch {
    m.reply("⚠️ El audio está tardando mucho, intenta otra canción 🎄");
  }
};

handler.command = ['play','mp3','yta','ytmp3','playaudio'];
handler.tags = ['downloader'];
export default handler;
