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

    const { id, title, info } = res.data;
    const downloadUrl = await ddownr.cekProgress(id);

    return {
      title,
      image: info.image,
      downloadUrl
    };
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
    if (!text) return conn.reply(m.chat, "⚠ Escribe el nombre de la canción.", m);

    const search = await yts(text);
    if (!search.all.length) return m.reply("Sin resultados.");

    const v = search.all.find(x => x.ago) || search.all[0];
    const { title, thumbnail, timestamp, views, ago, url } = v;

    const thumb = (await conn.getFile(thumbnail)).data;
    const vistaTexto = formatViews(views);

    // 🔮 DISEÑO FUTURISTA
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
│ ${v.author.name || 'Desconocido'}
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
          body: "Ultra Fast Audio",
          mediaType: 1,
          mediaUrl: url,
          sourceUrl: url,
          thumbnail: thumb,
          renderLargerThumbnail: true
        }
      }
    });

    // 🚀 AUDIO ULTRA INSTANTÁNEO + REACCIONES
    if (['play', 'yta', 'mp3', 'ytmp3', 'playaudio'].includes(command)) {

      // ⏳ Reacción cargando
      await conn.sendMessage(m.chat, {
        react: { text: "⏳", key: m.key }
      });

      try {
        const api = await ddownr.download(url, 'mp3');

        await conn.sendMessage(m.chat, {
          audio: { url: api.downloadUrl },
          mimetype: 'audio/ogg; codecs=opus',
          ptt: true,
          waveform: Array(40).fill(40)
        }, { quoted: m });

        // ⚡ Reacción listo
        await conn.sendMessage(m.chat, {
          react: { text: "⚡", key: m.key }
        });

      } catch {
        const api = await fetch(
          `https://api.stellarwa.xyz/dl/ytmp3?url=${url}&key=proyectsV2`
        ).then(r => r.json());

        await conn.sendMessage(m.chat, {
          audio: { url: api.data.dl },
          mimetype: 'audio/ogg; codecs=opus',
          ptt: true,
          waveform: Array(40).fill(40)
        }, { quoted: m });

        // ⚡ Reacción listo (fallback)
        await conn.sendMessage(m.chat, {
          react: { text: "⚡", key: m.key }
        });
      }
    }

    // 🎧 AUDIO DOCUMENTO
    else if (['play3','ytadoc','playdoc','ytmp3doc'].includes(command)) {
      const api = await ddownr.download(url, 'mp3');
      await conn.sendMessage(m.chat, {
        document: { url: api.downloadUrl },
        mimetype: 'audio/mpeg',
        fileName: `${title}.mp3`
      }, { quoted: m });
    }

    // 🎬 VIDEO
    else if (['play2','ytv','mp4','play4','ytvdoc','play2doc','ytmp4doc'].includes(command)) {
      const fuentes = [
        `https://api.stellarwa.xyz/dl/ytmp4?url=${url}&quality=720&key=proyectsV2`,
        `https://api.sylphy.xyz/download/ytmp4?url=${url}&apikey=sylphy-8ff8`
      ];

      for (let f of fuentes) {
        try {
          const r = await fetch(f).then(r => r.json());
          const dl = r.data?.dl || r.res?.url;
          if (!dl) continue;

          await conn.sendMessage(m.chat, {
            video: { url: dl },
            mimetype: 'video/mp4',
            caption: "🎬 Video listo",
            thumbnail: thumb
          }, { quoted: m });
          return;
        } catch {}
      }
      m.reply("No se pudo descargar el video.");
    }

  } catch (e) {
    console.error(e);
    m.reply("❌ Error inesperado.");
  }
};

handler.command = handler.help = [
  'play','play2','mp3','yta','mp4','ytv',
  'play3','ytadoc','playdoc','ytmp3doc',
  'play4','ytvdoc','play2doc','ytmp4doc'
];

handler.tags = ['downloader'];
export default handler;

function formatViews(v) {
  return v >= 1000
    ? `${(v / 1000).toFixed(1)}k (${v.toLocaleString()})`
    : v.toString();
        }
