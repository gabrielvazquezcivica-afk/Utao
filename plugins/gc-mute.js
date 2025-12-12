// gc-mute.js

let handler = async (m, { conn, args, isAdmin, usedPrefix }) => {
    const command = m.command.toLowerCase();
    const chat = m.chat;

    if (!m.isGroup)
        return conn.sendMessage(chat, { text: '❗ Este comando solo funciona en grupos.' });

    if (!isAdmin)
        return conn.sendMessage(chat, { text: '❗ Solo los admins pueden usar este comando.' });

    // Obtener usuario objetivo
    let target = m.mentionedJid?.[0] ||
        (args[0] ? args[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net' : null);

    if (!target)
        return conn.sendMessage(chat, { text: `Usa: ${usedPrefix}${command} @usuario`, quoted: m });

    // Asegurar base de datos
    if (!global.db) global.db = {};
    if (!global.db.muted) global.db.muted = {};
    if (!global.db.muted[chat]) global.db.muted[chat] = {};

    // --- MUTE ---
    if (command === "mute") {
        global.db.muted[chat][target] = true;
        await conn.sendMessage(chat, {
            text: `🔇 Usuario silenciado: @${target.split('@')[0]}`,
            mentions: [target]
        });
        await conn.sendMessage(chat, { react: { text: "🔇", key: m.key } });
    }

    // --- UNMUTE ---
    if (command === "unmute") {
        delete global.db.muted[chat][target];
        await conn.sendMessage(chat, {
            text: `🔈 Usuario desilenciado: @${target.split('@')[0]}`,
            mentions: [target]
        });
        await conn.sendMessage(chat, { react: { text: "🔈", key: m.key } });
    }

};

handler.help = ['mute @tag', 'unmute @tag'];
handler.tags = ['group'];
handler.command = /^mute|unmute$/i;

// ============================================================
// 📌 FILTRO GLOBAL "before": Elimina mensajes de usuarios muteados
// ============================================================

handler.before = async function (m, { conn }) {
    try {
        const chat = m.chat;
        const sender = m.sender;

        if (!global.db?.muted?.[chat]?.[sender]) return; // No está muteado, salir

        // Verificar si el mensaje tiene key válida
        if (!m.key || !m.key.id) return;

        // Borrado REAL compatible con Baileys v6–v7
        await conn.sendMessage(chat, {
            delete: {
                remoteJid: chat,
                fromMe: false,
                id: m.key.id,
                participant: m.key.participant || sender
            }
        });

    } catch (e) {
        console.error('Error borrando mensaje de muteado:', e);
    }
};

export default handler;
