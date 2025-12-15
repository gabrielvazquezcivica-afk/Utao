import fetch from "node-fetch";
import yts from "yt-search";
import axios from "axios";

const formatAudio = ['mp3'];

const ddownr = {
  download: async (url) => {
    const res = await axios.get(
      `https://p.savenow.to/ajax/download.php?format=mp3&url=${encodeURIComponent(url)}&api=dfcb6d76f2f6a9894gjkege8a4ab232222`
    );

    if (!res.data?.success) throw new Error("Error");

    const { id } = res.data;

    while (true) {
      const r = await axios.get(`https://p.savenow.to/ajax/progress?id=${id}`);
      if (r.data?.success && r.data.progress === 1000) {
        return r.data.download_url;
      }
      await new Promise(r => setTimeout(r, 2000));
    }
  }
};

const handler = async (m, { conn, text, command }) => {
  try {
    if (!text)
      return conn.reply(
        m.chat,
        "🎅 Ho ho ho… dime qué canción quieres encontrar bajo el árbol 🎄",
        m
      );

    const search = await yts(text);
    if (!search.all.length)
      return m.reply("☃️ No encontré esa canción en el Polo Norte 🎶");

    const v = search.all.find(x => x.ago) || search.all[0];
    const { title, thumbnail, timestamp, views, ago, url } = v;

    const thumb = (await conn.getFile(thumbnail)).data;

    const mensaje = `
🎄✨━━━━━━━━━━━━━━━━━━━━✨🎄
🎅  ${global.botname || conn.user?.name || 'CYBER-BOT'}
🎁 Música navideña en camino
━━━━━━━━━━━━━━━━━━━━━━━

🎶 ${title}
⏱ ${timestamp}
🗓 ${ago}

🎄 Enviando tu regalo musical…
⛄━━━━━━━━━━━━━━━━━━━━⛄
`;

    await conn.reply(m.chat, mensaje, m, {
      contextInfo: {
        externalAdReply: {
          title: `🎄 ${global.botname || "CYBER PLAYER"} 🎄`,
          body: "🎶 Audio rápido",
          mediaType: 1,
          mediaUrl: url,
          sourceUrl: url,
          thumbnail: thumb,
          renderLargerThumbnail: true
        }
      }
    });

    // ⚡ AUDIO RÁPIDO
    if (['play', 'yta', 'mp3', 'ytmp3', 'playaudio'].includes(command)) {

      await conn.sendMessage(m.chat, {
        react: { text: "⚡", key: m.key }
      });

      try {
        // 🚀 API RÁPIDA (PRIMERO)
        const fast = await fetch(
          `https://api.stellarwa.xyz/dl/ytmp3?url=${url}&key=proyectsV2`
        ).then(r => r.json());

        await conn.sendMessage(m.chat, {
          audio: { url: fast.data.dl },
          mimetype: 'audio/mpeg',
          ptt: false
        }, { quoted: m });

      } catch {
        // 🛟 RESPALDO LENTO
        const slow = await ddownr.download(url);

        await conn.sendMessage(m.chat, {
          audio: { url: slow },
          mimetype: 'audio/mpeg',
          ptt: false
        }, { quoted: m });
      }

      await conn.sendMessage(m.chat, {
        react: { text: "🎁", key: m.key }
      });
    }

    // 🎧 DOCUMENTO
    else if (['play3','ytadoc','playdoc','ytmp3doc'].includes(command)) {
      const fast = await fetch(
        `https://api.stellarwa.xyz/dl/ytmp3?url=${url}&key=proyectsV2`
      ).then(r => r.json());

      await conn.sendMessage(m.chat, {
        document: { url: fast.data.dl },
        mimetype: 'audio/mpeg',
        fileName: `🎄 ${title}.mp3`
      }, { quoted: m });
    }

  } catch (e) {
    console.error(e);
    m.reply("❌ El duende tropezó con los cables 🎅");
  }
};

handler.command = handler.help = [
  'play','mp3','yta','ytmp3','playaudio',
  'play3','ytadoc','playdoc','ytmp3doc'
];

handler.tags = ['downloader'];
export default handler;
