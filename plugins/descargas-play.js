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

    const { id, info } = res.data;
    const downloadUrl = await ddownr.cekProgress(id);

    return { downloadUrl };
  },

  cekProgress: async (id) => {
    while (true) {
      const r = await axios.get(`https://p.savenow.to/ajax/progress?id=${id}`);
      if (r.data?.success && r.data.progress === 1000) {
        return r.data.download_url;
      }
      await new Promise(r => setTimeout(r, 2500));
    }
  }
};

const handler = async (m, { conn, text, command }) => {
  try {
    if (!text) return conn.reply(m.chat, "🎄 Escribe el nombre de la canción 🎶", m);

    const search = await yts(text);
    if (!search.all.length) return m.reply("☃️ No encontré resultados.");

    const v = search.all.find(x => x.ago) || search.all[0];
    const { title, thumbnail, timestamp, views, ago, url } = v;

    const thumb = (await conn.getFile(thumbnail)).data;
    const vistaTexto = formatViews(views);

    const mensaje = `
🎅━━━━━━━━━━━━━━━━━━━━🎅
🎄  ${global.botname || conn.user?.name || 'CYBER-BOT'}  🎄
━━━━━━━━━━━━━━━━━━━━━━

🎶 *CANCIÓN*
❄️ ${title}

⏱ *DURACIÓN*
🕯 ${timestamp}

👁 *VISTAS*
⭐ ${vistaTexto}

📡 *CANAL*
🎤 ${v.author.name || 'Desconocido'}

🕒 *PUBLICADO*
🗓 ${ago}

🔗 *YOUTUBE*
🎥 ${url}

━━━━━━━━━━━━━━━━━━━━━━
🎁 *PREPARANDO TU AUDIO…*
⛄━━━━━━━━━━━━━━━━━━━━⛄
`;

    await conn.reply(m.chat, mensaje, m, {
      contextInfo: {
        externalAdReply: {
          title: `🎄 ${global.botname || "CYBER PLAYER"} 🎄`,
          body: "🎶 Christmas Audio Player",
          mediaType: 1,
          mediaUrl: url,
          sourceUrl: url,
          thumbnail: thumb,
          renderLargerThumbnail: true
        }
      }
    });

    // ▶ AUDIO NORMAL
    if (['play', 'yta', 'mp3', 'ytmp3', 'playaudio'].includes(command)) {

      await conn.sendMessage(m.chat, {
        react: { text: "🎄", key: m.key }
      });

      try {
        const api = await ddownr.download(url, 'mp3');

        await conn.sendMessage(m.chat, {
          audio: { url: api.downloadUrl },
          mimetype: 'audio/mpeg',
          ptt: false
        }, { quoted: m });

        await conn.sendMessage(m.chat, {
          react: { text: "🎁", key: m.key }
        });

      } catch {
        const api = await fetch(
          `https://api.stellarwa.xyz/dl/ytmp3?url=${url}&key=proyectsV2`
        ).then(r => r.json());

        await conn.sendMessage(m.chat, {
          audio: { url: api.data.dl },
          mimetype: 'audio/mpeg',
          ptt: false
        }, { quoted: m });

        await conn.sendMessage(m.chat, {
          react: { text: "🎁", key: m.key }
        });
      }
    }

    // 🎧 AUDIO DOCUMENTO
    else if (['play3','ytadoc','playdoc','ytmp3doc'].includes(command)) {
      const api = await ddownr.download(url, 'mp3');
      await conn.sendMessage(m.chat, {
        document: { url: api.downloadUrl },
        mimetype: 'audio/mpeg',
        fileName: `🎄 ${title}.mp3`
      }, { quoted: m });
    }

  } catch (e) {
    console.error(e);
    m.reply("❌ Error inesperado ❄️");
  }
};

handler.command = handler.help = [
  'play','mp3','yta','ytmp3','playaudio',
  'play3','ytadoc','playdoc','ytmp3doc'
];

handler.tags = ['downloader'];
export default handler;

function formatViews(v) {
  return v >= 1000
    ? `${(v / 1000).toFixed(1)}k (${v.toLocaleString()})`
    : v.toString();
          }
