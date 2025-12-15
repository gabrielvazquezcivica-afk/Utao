import fetch from "node-fetch";
import yts from "yt-search";
import axios from "axios";

const formatAudio = ['mp3'];

const ddownr = {
  download: async (url) => {
    const res = await axios.get(
      `https://p.savenow.to/ajax/download.php?format=mp3&url=${encodeURIComponent(url)}&api=dfcb6d76f2f6a9894gjkege8a4ab232222`
    );
    if (!res.data?.success) throw new Error();
    return await ddownr.cekProgress(res.data.id);
  },

  cekProgress: async (id) => {
    while (true) {
      const r = await axios.get(`https://p.savenow.to/ajax/progress?id=${id}`);
      if (r.data?.progress === 1000) return r.data.download_url;
      await new Promise(r => setTimeout(r, 1200));
    }
  }
};

const handler = async (m, { conn, text }) => {
  if (!text) return m.reply("🎧 Escribe una canción");

  const search = await yts(text);
  if (!search.videos.length) return m.reply("❌ Sin resultados");

  const v = search.videos[0];

  await conn.sendMessage(m.chat, {
    text: `🎶 ${v.title}`,
    contextInfo: {
      externalAdReply: {
        title: v.title,
        thumbnailUrl: v.thumbnail,
        mediaType: 1,
        mediaUrl: v.url,
        sourceUrl: v.url,
        renderLargerThumbnail: true
      }
    }
  }, { quoted: m });

  const dl = await ddownr.download(v.url);
  const res = await fetch(dl);
  const audioBuffer = Buffer.from(await res.arrayBuffer());

  await conn.sendMessage(m.chat, {
    audio: audioBuffer,
    mimetype: 'audio/mpeg',
    ptt: false
  }, { quoted: m });
};

handler.command = /^(play|mp3|yta|ytmp3|playaudio)$/i;
handler.help = ['play <texto>'];
handler.tags = ['downloader'];

export default handler;
