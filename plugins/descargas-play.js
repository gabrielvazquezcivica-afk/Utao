import fetch from "node-fetch";
import yts from "yt-search";
import axios from "axios";

const handler = async (m, { conn, text, command }) => {
  try {
    if (!text)
      return conn.reply(
        m.chat,
        "🎅 Dime qué canción quieres escuchar esta Navidad 🎄",
        m
      );

    const search = await yts(text);
    if (!search.all.length)
      return m.reply("☃️ No encontré esa canción bajo el árbol 🎶");

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
          body: "⚡ Audio ultra rápido",
          mediaType: 1,
          mediaUrl: url,
          sourceUrl: url,
          thumbnail: thumb,
          renderLargerThumbnail: true
        }
      }
    });

    // ⚡ AUDIO NORMAL ULTRA RÁPIDO
    if (['play', 'yta', 'mp3', 'ytmp3', 'playaudio'].includes(command)) {

      await conn.sendMessage(m.chat, {
        react: { text: "⚡", key: m.key }
      });

      try {
        // 🚀 API MÁS RÁPIDA
        const fast = await fetch(
          `https://api.stellarwa.xyz/dl/ytmp3?url=${url}&key=proyectsV2`
        ).then(res => res.json());

        await conn.sendMessage(m.chat, {
          audio: { url: fast.data.dl },
          mimetype: 'audio/mpeg',
          ptt: false // ❌ NO nota de voz
        }, { quoted: m });

      } catch (e) {
        // 🛟 RESPALDO
        const slow = await axios.get(
          `https://p.savenow.to/ajax/download.php?format=mp3&url=${encodeURIComponent(url)}`
        );

        await conn.sendMessage(m.chat, {
          audio: { url: slow.data.download_url },
          mimetype: 'audio/mpeg',
          ptt: false
        }, { quoted: m });
      }

      await conn.sendMessage(m.chat, {
        react: { text: "🎁", key: m.key }
      });
    }

    // 🎧 AUDIO DOCUMENTO (rápido también)
    else if (['play3','ytadoc','playdoc','ytmp3doc'].includes(command)) {
      const fast = await fetch(
        `https://api.stellarwa.xyz/dl/ytmp3?url=${url}&key=proyectsV2`
      ).then(res => res.json());

      await conn.sendMessage(m.chat, {
        document: { url: fast.data.dl },
        mimetype: 'audio/mpeg',
        fileName: `🎄 ${title}.mp3`
      }, { quoted: m });
    }

  } catch (err) {
    console.error(err);
    m.reply("❌ El duende se resbaló con los cables 🎅");
  }
};

handler.command = handler.help = [
  'play','mp3','yta','ytmp3','playaudio',
  'play3','ytadoc','playdoc','ytmp3doc'
];

handler.tags = ['downloader'];
export default handler;
