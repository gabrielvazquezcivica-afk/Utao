// gc-promote.js
let handler = async (m, { conn, args, isAdmin, isBotAdmin, usedPrefix }) => {
  const chat = m.chat;
  const command = m.command.toLowerCase();

  if (!m.isGroup)
    return conn.sendMessage(chat, { text: '❗ Este comando solo funciona en grupos.' });

  // Debe ser admin para promover/despromover
  if (!isAdmin)
    return conn.sendMessage(chat, { text: '❗ Solo los administradores pueden usar este comando.' });

  // El bot también debe ser admin del grupo
  if (!isBotAdmin)
    return conn.sendMessage(chat, { text: '❗ Necesito permisos de admin para ejecutar esto.' });

  // Obtener usuario objetivo
  let target = m.mentionedJid?.[0] ||
    (args[0] ? args[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net' : null);

  if (!target)
    return conn.sendMessage(chat, { text: `Usa: ${usedPrefix}${command} @usuario`, quoted: m });

  // Evitar promover/despromover al propio bot equivocadamente
  if (target === conn.user.jid)
    return conn.sendMessage(chat, { text: 'No puedo cambiar mis propios permisos.' });

  try {
    // PROMOVER
    if (command === 'promote') {
      await conn.groupMakeAdmin(chat, [target]);
      await conn.sendMessage(chat, {
        text: `✅ @${target.split('@')[0]} ha sido promovido a administrador.`,
        mentions: [target]
      });
      await conn.sendMessage(chat, { react: { text: "📈", key: m.key } });
    }

    // DESPROMOVER
    if (command === 'demote') {
      await conn.groupDemoteAdmin(chat, [target]);
      await conn.sendMessage(chat, {
        text: `✅ @${target.split('@')[0]} ha sido despromovido.`,
        mentions: [target]
      });
      await conn.sendMessage(chat, { react: { text: "📉", key: m.key } });
    }
  } catch (err) {
    console.error(err);
    return conn.sendMessage(chat, {
      text: '❗ Ocurrió un error al cambiar permisos. Asegúrate de que el bot tenga admin y que el usuario no sea el propietario.',
      quoted: m
    });
  }
};

handler.help = ['promote @tag', 'demote @tag'];
handler.tags = ['group'];
handler.command = /^promote|demote$/i;

export default handler;
