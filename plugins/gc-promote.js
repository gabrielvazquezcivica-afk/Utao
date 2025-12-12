/**
 * gc-promote.js (mejorado)
 * Ahora incluye reacciones y mensajes de confirmación más completos.
 */

export default async function handler(m, { conn, isAdmin, isBotAdmin, usedPrefix, command, args }) {

  const chat = m.chat;

  if (!m.isGroup) {
    await conn.sendMessage(chat, { react: { text: "❌", key: m.key } });
    return conn.sendMessage(chat, '❌ *Este comando solo funciona en grupos.*', { quoted: m });
  }

  if (!isAdmin) {
    await conn.sendMessage(chat, { react: { text: "🚫", key: m.key } });
    return conn.sendMessage(chat, '🚫 *Solo los administradores pueden usar este comando.*', { quoted: m });
  }

  if (!isBotAdmin) {
    await conn.sendMessage(chat, { react: { text: "⚠️", key: m.key } });
    return conn.sendMessage(chat, '⚠️ *Necesito ser administrador para gestionar roles.*', { quoted: m });
  }

  // Obteniendo usuario objetivo
  let target = m.mentionedJid && m.mentionedJid[0];
  if (!target && args.length) {
    const number = args[0].replace(/[^0-9]/g, '');
    if (number) target = number + '@s.whatsapp.net';
  }

  if (!target) {
    await conn.sendMessage(chat, { react: { text: "❓", key: m.key } });
    return conn.sendMessage(chat, `📌 *Uso correcto:* ${usedPrefix}${command} @usuario`, { quoted: m });
  }

  // Obtener admins del grupo
  const groupAdmins = (await conn.groupMetadata(chat)).participants
    .filter(u => u.admin)
    .map(u => u.id);

  const username = "@"+target.split("@")[0];

  // PROMOVER
  if (command.toLowerCase() === "promote") {

    if (groupAdmins.includes(target)) {
      await conn.sendMessage(chat, { react: { text: "⚠️", key: m.key } });
      return conn.sendMessage(chat, `⚠️ ${username} *ya es administrador.*`, {
        mentions: [target],
        quoted: m
      });
    }

    await conn.groupParticipantsUpdate(chat, [target], "promote");

    await conn.sendMessage(chat, { react: { text: "🟢", key: m.key } });

    return conn.sendMessage(chat,
      `🎉 *Promoción exitosa*\n\n` +
      `✨ ${username} ahora es *administrador del grupo*.\n` +
      `🛡️ Gracias por apoyar a la comunidad.`,
      {
        mentions: [target],
        quoted: m
      }
    );
  }

  // DEMOVER
  if (command.toLowerCase() === "demote") {

    if (!groupAdmins.includes(target)) {
      await conn.sendMessage(chat, { react: { text: "⚠️", key: m.key } });
      return conn.sendMessage(chat, `⚠️ ${username} *no es administrador.*`, {
        mentions: [target],
        quoted: m
      });
    }

    await conn.groupParticipantsUpdate(chat, [target], "demote");

    await conn.sendMessage(chat, { react: { text: "🔴", key: m.key } });

    return conn.sendMessage(chat,
      `🔻 *Democión realizada*\n\n` +
      `💬 ${username} *ya no es administrador* del grupo.\n` +
      `📍 Aplique las reglas según corresponda.`,
      {
        mentions: [target],
        quoted: m
      }
    );
  }

  // Si el comando no es válido
  await conn.sendMessage(chat, { react: { text: "❌", key: m.key } });
  return conn.sendMessage(chat, `❌ *Comando desconocido.* Usa:* ${usedPrefix}promote o ${usedPrefix}demote`, { quoted: m });
                          }
