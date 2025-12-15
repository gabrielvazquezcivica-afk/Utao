import fetch from "node-fetch";
import yts from "yt-search";
import axios from "axios";

const formatAudio = ['mp3', 'm4a', 'webm', 'acc', 'flac', 'opus', 'ogg', 'wav'];
const formatVideo = ['360', '480', '720', '1080', '1440', '4k'];

const ddownr = {
  download: async (url, format) => {
    if (!formatAudio.includes(format) && !formatVideo.includes(format)) {
      throw new Error("Formato no soportado.");
    }

    const res = await axios.get(
      `https://p.savenow.to/ajax/download.php?format=${format}&url=${encodeURIComponent(url)}&api=dfcb6d76f2f6a9894gjkege8a4ab232222`
    );

    if (!res.data?.success) throw new Error("Error al procesar.");

    const { id } = res.data;
    return await ddownr.cekProgress(id);
  },

  cekProgress: async (id) => {
    while (true) {
      const r = await axios.get(`https://p.savenow.to/ajax/progress?id=${id}`);
      if (r.data?.success && r.data.progress === 1000) {
        return r.data.download_url;
      }
      await new Promise(r => setTimeout(r, 1500));
    }
  }
};

const handler = async (m, { conn, text, command }) => {
  try {
    if (!text) return conn.reply(m.chat, "⚠ Escribe el nombre de la canción.", m);

    const search = await yts(text);
    if (!search.all.length) return m.reply("Sin resultados.");

    const v = search.all.find(x => x.ago) || search.all[0];
    const { title, thumbnail, timestamp, views, ago, url } = v;

    const thumb = (await conn.getFile(thumbnail)).data;
    const vistaTexto = formatViews(views);

    const mensaje = `
┌─〔 ⚡ ${global.botname || conn.user?.name || 'CYBER-BOT'} ⚡ 〕─┐
│ 🎶 𝗧𝗥𝗔𝗖𝗞
│ ${title}
│
│ ⏱ 𝗗𝗨𝗥𝗔𝗖𝗜𝗢𝗡
│ ${timestamp}
│
│ 👁 𝗩𝗜𝗦𝗧𝗔𝗦
│ ${vistaTexto}
│
│ 📡 𝗖𝗔𝗡𝗔𝗟
│ ${v.author?.name || 'Desconocido'}
│
│ 🕒 𝗣𝗨𝗕𝗟𝗜𝗖𝗔𝗗𝗢
│ ${ago}
│
│ 🔗 𝗬𝗢𝗨𝗧𝗨𝗕𝗘
│ ${url}
└────────────────────┘
⏳ 𝗖𝗔𝗥𝗚𝗔𝗡𝗗𝗢 𝗔𝗨𝗗𝗜𝗢…
`;

    await conn.reply(m.chat, mensaje, m, {
      contextInfo: {
        externalAdReply: {
          title: global.botname || "CYBER PLAYER",
          body: "Fast Audio",
          mediaType: 1,
          mediaUrl: url,
          sourceUrl: url,
          thumbnail: thumb,
          renderLargerThumbnail: true
        }
      }
    });

    // ▶ AUDIO NORMAL (RÁPIDO)
    if (['play', 'yta', 'mp3', 'ytmp3', 'playaudio'].includes(command)) {

      await conn.sendMessage(m.chat, {
        react: { text: "⏳", key: m.key }
      });

      let audioBuffer;

      try {
        // MÉTODO 1: ddownr → buffer
        const dlUrl = await ddownr.download(url, 'mp3');
        const res = await fetch(dlUrl);
        audioBuffer = await res.buffer();

      } catch {
        // MÉTODO 2: Stellar → buffer
        const api = await fetch(
          `https://api.stellarwa.xyz/dl/ytmp3?url=${encodeURIComponent(url)}&key=proyectsV2`
        ).then(r => r.json());

        if (!api?.data?.dl) throw new Error("Backup falló");

        const res = await fetch(api.data.dl);
        audioBuffer = await res.buffer();
      }

      // ✅ ENVÍO FINAL (COMO EL BOT DE LA IMAGEN)
      await conn.sendMessage(m.chat, {
        audio: audioBuffer,
        mimetype: 'audio/mpeg',
        ptt: false
      }, { quoted: m });

      await conn.sendMessage(m.chat, {
        react: { text: "⚡", key: m.key }
      });
    }

    // 🎧 AUDIO DOCUMENTO
    else if (['play3','ytadoc','playdoc','ytmp3doc'].includes(command)) {
      const dlUrl = await ddownr.download(url, 'mp3');
      await conn.sendMessage(m.chat, {
        document: { url: dlUrl },
        mimetype: 'audio/mpeg',
        fileName: `${title}.mp3`
      }, { quoted: m });
    }

  } catch (e) {
    console.error(e);
    m.reply("❌ Error inesperado.");
  }
};

handler.command = handler.help = [
  'play','mp3','yta','ytmp3','playaudio',
  'play3','ytadoc','playdoc','ytmp3doc'
];

handler.tags = ['downloader'];
export default handler;

function formatViews(v) {
  if (!v) return "0";
  return v >= 1000
    ? `${(v / 1000).toFixed(1)}k (${v.toLocaleString()})`
    : v.toString();
        }  throw new Error('Timeout');
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
