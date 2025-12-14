// PLAY COMPLETO – SOLO PLAY OPTIMIZADO A MÁXIMA VELOCIDAD ⚡ // Se mantiene toda tu estructura original // Se elimina savenow SOLO para play / mp3

import fetch from "node-fetch"; import yts from "yt-search";

const FAST_APIS = [ url => https://api.stellarwa.xyz/dl/ytmp3?url=${encodeURIComponent(url)}&key=proyectsV2, url => https://api.sylphy.xyz/download/ytmp3?url=${encodeURIComponent(url)}&apikey=sylphy-8ff8 ];

const handler = async (m, { conn, text, command }) => { try { if (!text?.trim()) return conn.reply(m.chat, '✎ Ingresa el nombre de la música.', m);

// 🔍 Buscar en YouTube
const search = await yts(text);
if (!search?.videos?.length) return m.reply('No se encontraron resultados.');

const videoInfo = search.videos[0];
const { title, thumbnail, timestamp, views, ago, url, author } = videoInfo;

// thumbnail opcional eliminado para máxima compatibilidad
const thumb = null;

const botName = conn.user?.name || 'MI BOT';

const mensaje = `*╭─⬣「 🚀 ${botName} 」⬣─╮*

┃ 🎧 Título: ${title} ┃ ⏱️ Duración: ${timestamp} ┃ 👁️ Vistas: ${views.toLocaleString()} ┃ 👤 Canal: ${author?.name || 'Desconocido'} ┃ 📅 Publicado: ${ago || '—'} ┃ 🔗 Link: ${url} ╰─⬣━━━━━━━━━━━━⬣─╯`;

// Mensaje informativo (no bloqueante)
// Mensaje informativo simple (sin externalAdReply para evitar fallos)
await conn.reply(m.chat, mensaje, m);

// ⚡ PLAY / MP3 – MÁXIMA VELOCIDAD
if (['play', 'yta', 'mp3', 'ytmp3', 'playaudio'].includes(command)) {
  await m.react('⏳');

  let dl = null;

  for (const api of FAST_APIS) {
    try {
      const res = await fetch(api(url)).then(r => r.json());
      dl = res?.data?.dl || res?.result?.url || res?.url;
      if (dl) break;
    } catch {}
  }

  if (!dl) throw 'No se pudo obtener el audio';

  await conn.sendMessage(m.chat, {
    audio: { url: dl },
    mimetype: 'audio/mpeg',
    fileName: `${title}.mp3`
  }, { quoted: m });

  await m.react('✅');
  return;
}

// 🗂️ PLAY DOC (se mantiene lento si usas savenow luego)
if (['play3', 'ytadoc', 'playdoc', 'ytmp3doc'].includes(command)) {
  const api = await fetch(FAST_APIS[0](url)).then(r => r.json());
  const dl = api?.data?.dl;
  if (!dl) throw 'No se pudo obtener el audio';

  await conn.sendMessage(m.chat, {
    document: { url: dl },
    mimetype: 'audio/mpeg',
    fileName: `${title}.mp3`
  }, { quoted: m });
  return;
}

// 🎬 VIDEO (SIN CAMBIOS – puedes optimizar luego)
if (['play2', 'ytv', 'mp4', 'play4', 'ytvdoc', 'play2doc', 'ytmp4doc'].includes(command)) {
  const fuentes = [
    `https://api.stellarwa.xyz/dl/ytmp4?url=${encodeURIComponent(url)}&key=proyectsV2`,
    `https://api.sylphy.xyz/download/ytmp4?url=${encodeURIComponent(url)}&apikey=sylphy-8ff8`
  ];

  for (const fuente of fuentes) {
    try {
      const res = await fetch(fuente).then(r => r.json());
      const dl = res?.data?.dl || res?.result?.url;
      if (!dl) continue;

      await conn.sendMessage(m.chat, {
        video: { url: dl },
        mimetype: 'video/mp4',
        fileName: `${title}.mp4`
      }, { quoted: m });
      return;
    } catch {}
  }

  return m.reply('❌ No se pudo descargar el video.');
}

} catch (error) { console.error(error); return m.reply('⚠️ Error general al procesar el comando.'); } };

handler.command = handler.help = [ 'play', 'mp3', 'yta', 'playaudio', 'play2', 'ytv', 'mp4', 'play3', 'ytadoc', 'playdoc', 'ytmp3doc', 'play4', 'ytvdoc', 'play2doc', 'ytmp4doc' ];

handler.tags = ['downloader']; export default handler;
