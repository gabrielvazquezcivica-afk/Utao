/**
 * gc-mute.js
 * Comandos: mute, unmute
 * Silencia/desilencia al usuario y borra sus mensajes/stickers si está muteado
 */

export default async function handler(m, { conn, args, isAdmin, groupMetadata, usedPrefix }) {
  const command = m.command.toLowerCase();
  const chat = m.chat;

  if (!m.isGroup) return conn.sendMessage(chat, 'Este comando solo funciona en grupos.', { quoted: m });

  // Solo admins pueden usar
  if (!isAdmin) return conn.sendMessage(chat, 'Solo administradores pueden usar este comando.', { quoted: m });

  // Identificar al usuario objetivo
  let target = m.mentionedJid && m.mentionedJid[0];
  if (!target && args[0]) target = args[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net';
  if (!target) return conn.sendMessage(chat, `Usa: ${usedPrefix}${command} @usuario`, { quoted: m });

  if (target === conn.user.jid) return conn.sendMessage(chat, 'No puedes mutear al bot.', { quoted: m });

  // Inicializar DB si hace falta
  global.db = global.db || { muted: {} };
  global.db.muted[chat] = global.db.muted[chat] || {};

  // MUTE
  if (command === 'mute') {
    if (global.db.muted[chat][target]) {
      return conn.sendMessage(chat, 'Este usuario ya está muteado.', { quoted: m });
    }
    global.db.muted[chat][target] = true;
    return conn.sendMessage(chat, `🔇 @${target.split('@')[0]} silenciado.`, { quoted: m, mentions: [target] });
  }

  // UNMUTE
  if (command === 'unmute') {
    if (!global.db.muted[chat][target]) {
      return conn.sendMessage(chat, 'Este usuario no estaba muteado.', { quoted: m });
    }
    delete global.db.muted[chat][target];
    return conn.sendMessage(chat, `🔈 @${target.split('@')[0]} desilenciado.`, { quoted: m, mentions: [target] });
  }
}

// FILTRO de mensajes para borrar si está muteado
conn.ev.on('messages.upsert', async ({ messages }) => {
  try {
    for (const msg of messages) {
      if (!msg.key.fromMe && msg.message) {
        const chat = msg.key.remoteJid;
        const sender = msg.key.participant || msg.key.remoteJid; // usuario
        if (global.db?.muted?.[chat]?.[sender]) {
          // Borrar mensaje (texto, sticker, media)
          await conn.sendMessage(chat, { delete: msg.key });
        }
      }
    }
  } catch (e) {
    console.error('Error al eliminar mensaje muteado:', e);
  }
});
