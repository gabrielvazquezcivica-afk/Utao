import fetch from "node-fetch";
import yts from "yt-search";
import axios from "axios";

/* ===============================
   FUNCIÓN AUDIO RÁPIDO (SEGURA)
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
   HANDLER
================================ */
const handler = async (m, { conn, text, command }) => {
  try {
    if (!text) {
      return conn.reply(
        m.chat,
        "🎅 Ho ho ho… dime qué canción quieres encontrar bajo el árbol 🎄",
        m
      );
    }

    const search = await yts(text);
    if (!search.all.length) {
      return m.reply("☃️ No encontré esa canción en el Polo Norte 🎶");
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
          body: "⚡ Audio rápido y seguro",
          mediaType: 1,
          mediaUrl: url,
          sourceUrl: url,
          thumbnail: thumb,
          renderLargerThumbnail: true
        }
      }
    });

    /* ===============================
       AUDIO NORMAL RÁPIDO
    ================================ */
    if (['play', 'yta', 'mp3', 'ytmp3', 'playaudio'].includes(command)) {

      await conn.sendMessage(m.chat, {
        react: { text: "⚡", key: m.key }
      });

      let audioUrl;

      try {
        // 🚀 PRIMERO: API RÁPIDA
        audioUrl = await getFastAudio(url);
      } catch {
        // 🛟 RESPALDO SEGURO
        const slow = await axios.get(
          `https://p.savenow.to/ajax/download.php?format=mp3&url=${encodeURIComponent(url)}`
        );
        audioUrl = slow?.data?.download_url;
      }

      if (!audioUrl) {
        return m.reply("❌ No pude envolver tu regalo musical 🎁");
      }

      await conn.sendMessage(m.chat, {
        audio: { url: audioUrl },
        mimetype: 'audio/mpeg',
        ptt: false // ❌ NO nota de voz
      }, { quoted: m });

      await conn.sendMessage(m.chat, {
        react: { text: "🎁", key: m.key }
      });
    }

    /* ===============================
       AUDIO DOCUMENTO
    ================================ */
    else if (['play3','ytadoc','playdoc','ytmp3doc'].includes(command)) {
      const audioUrl = await getFastAudio(url);

      await conn.sendMessage(m.chat, {
        document: { url: audioUrl },
        mimetype: 'audio/mpeg',
        fileName: `🎄 ${title}.mp3`
      }, { quoted: m });
    }

  } catch (err) {
    console.error(err);
    m.reply("❌ El duende se enredó con los cables 🎅");
  }
};

handler.command = handler.help = [
  'play','mp3','yta','ytmp3','playaudio',
  'play3','ytadoc','playdoc','ytmp3doc'
];

handler.tags = ['downloader'];
export default handler;
