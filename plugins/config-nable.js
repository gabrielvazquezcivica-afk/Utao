const handler = async (m, {conn, usedPrefix, command, args, isOwner, isAdmin, isROwner}) => {

let fkontak = { 
    "key": { 
        "participants":"0@s.whatsapp.net", 
        "remoteJid": "status@broadcast", 
        "fromMe": false, 
        "id": "Halo" 
    }, 
    "message": { 
        "contactMessage": { 
            "vcard": `BEGIN:VCARD\nVERSION:3.0\nN:Sy;Bot;;;\nFN:y\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD` 
        }
    }, 
    "participant": "0@s.whatsapp.net" 
}

const miniopcion = `✫ *OPCIONES PARA GRUPOS*

${usedPrefix + command} welcome
${usedPrefix + command} autoaceptar
${usedPrefix + command} autorechazar
${usedPrefix + command} autoresponder
${usedPrefix + command} detect
${usedPrefix + command} antidelete
${usedPrefix + command} antilink
${usedPrefix + command} antilink2
${usedPrefix + command} nsfw
${usedPrefix + command} autolevelup
${usedPrefix + command} subbots
${usedPrefix + command} autosticker
${usedPrefix + command} reaction
${usedPrefix + command} antitoxic
${usedPrefix + command} audios
${usedPrefix + command} modoadmin
${usedPrefix + command} antifake
${usedPrefix + command} antibot
${usedPrefix + command} antibot2
${usedPrefix + command} autoaceptar

♕︎ *OPCIONES PARA MI PROPIETARIO*

${usedPrefix + command} public
${usedPrefix + command} status
${usedPrefix + command} serbot
${usedPrefix + command} restrict
${usedPrefix + command} autoread
${usedPrefix + command} antillamar
${usedPrefix + command} antispam
${usedPrefix + command} pconly
${usedPrefix + command} gconly
${usedPrefix + command} antiprivado`

const isEnable = /true|enable|(turn)?on|1/i.test(command);
const chat = global.db.data.chats[m.chat];
const user = global.db.data.users[m.sender];
const bot = global.db.data.settings[conn.user.jid] || {};
const type = (args[0] || '').toLowerCase();
let isAll = false; 
const isUser = false;

switch (type) {

case 'welcome': case 'bienvenida':
    if (!m.isGroup && !isOwner) return global.dfail('group', m, conn)
    if (m.isGroup && !isAdmin) return global.dfail('admin', m, conn)
    chat.welcome = isEnable
break

case 'autoresponder': case 'autorespond':
    if (!m.isGroup && !isOwner) return global.dfail('group', m, conn)
    if (m.isGroup && !isAdmin) return global.dfail('admin', m, conn)
    chat.autoresponder = isEnable
break

case 'detect': case 'avisos':
    if (!m.isGroup && !isOwner) return global.dfail('group', m, conn)
    if (m.isGroup && !isAdmin) return global.dfail('admin', m, conn)
    chat.detect = isEnable
break

case 'antibot':
    if (m.isGroup && !(isAdmin || isOwner)) return global.dfail('admin', m, conn)
    chat.antiBot = isEnable
break

case 'antisubots': case 'antisub': case 'antisubot': case 'antibot2':
    if (m.isGroup && !(isAdmin || isOwner)) return global.dfail('admin', m, conn)
    chat.antiBot2 = isEnable
break

case 'antidelete': case 'antieliminar':
    if (m.isGroup && !(isAdmin || isOwner)) return global.dfail('admin', m, conn)
    chat.delete = isEnable
break

case 'public':
    isAll = true
    if (!isROwner) return global.dfail('rowner', m, conn)
    global.opts['self'] = !isEnable
break

case 'antilink': case 'antienlace':
    if (m.isGroup && !(isAdmin || isOwner)) return global.dfail('admin', m, conn)
    chat.antiLink = isEnable
break

case 'antilink2': case 'antienlace2':
    if (m.isGroup && !(isAdmin || isOwner)) return global.dfail('admin', m, conn)
    chat.antiLink2 = isEnable 
break

case 'antitiktok': case 'antitk':
    if (m.isGroup && !(isAdmin || isOwner)) return global.dfail('admin', m, conn)
    chat.antiTiktok = isEnable
break

case 'antiyoutube': case 'antiyt':
    if (m.isGroup && !(isAdmin || isOwner)) return global.dfail('admin', m, conn)
    chat.antiYoutube = isEnable
break

case 'antitelegram':
    if (m.isGroup && !(isAdmin || isOwner)) return global.dfail('admin', m, conn)
    chat.antiTelegram = isEnable
break

case 'antifacebook':
    if (m.isGroup && !(isAdmin || isOwner)) return global.dfail('admin', m, conn)
    chat.antiFacebook = isEnable
break

case 'antiinstagram':
    if (m.isGroup && !(isAdmin || isOwner)) return global.dfail('admin', m, conn)
    chat.antiInstagram = isEnable
break

case 'antitwitter': case 'antix':
    if (m.isGroup && !(isAdmin || isOwner)) return global.dfail('admin', m, conn)
    chat.antiTwitter = isEnable
break

case 'autolevelup':
    if (m.isGroup && !(isAdmin || isOwner)) return global.dfail('admin', m, conn)
    chat.autolevelup = isEnable
break

case 'autosticker':
    if (m.isGroup && !(isAdmin || isOwner)) return global.dfail('admin', m, conn)
    chat.autosticker = isEnable
break

case 'reaction':
    if (m.isGroup && !(isAdmin || isOwner)) return global.dfail('admin', m, conn)
    chat.reaction = isEnable
break

case 'antitoxic':
    if (m.isGroup && !(isAdmin || isOwner)) return global.dfail('admin', m, conn)
    chat.antitoxic = isEnable
break

case 'audios':
    if (m.isGroup && !(isAdmin || isOwner)) return global.dfail('admin', m, conn)
    chat.audios = isEnable
break

case 'antifake':
    if (m.isGroup && !(isAdmin || isOwner)) return global.dfail('admin', m, conn)
    chat.antifake = isEnable
break

case 'modoadmin':
    if (m.isGroup && !(isAdmin || isOwner)) return global.dfail('admin', m, conn)
    chat.modoadmin = isEnable
break

default:
    if (!/[01]/.test(command)) 
        return conn.reply(m.chat, miniopcion, fkontak)
    throw false
}

conn.reply(m.chat, `𖤍 *La Función ${type} Se Ha ${isEnable ? 'Activado' : 'Desactivado'}*`, fkontak)

}
handler.help = ['enable <option>', 'disable <option>']
handler.tags = ['nable', 'owner']
handler.command = ['enable', 'disable', 'on', 'off']
export default handler
