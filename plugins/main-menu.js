import fs, { promises } from 'fs'
import { join } from 'path'
import fetch from 'node-fetch'
import { xpRange } from '../lib/levelling.js'

let tags = {
  main: '🎄 INFO BOT 🎄',
  buscador: '🔍 BUSCADORES',
  fun: '🎮 JUEGOS',
  jadibot: '⚡ SER BOT',
  rpg: '⚔️ RPG',
  rg: '📩 REGISTRO',
  xp: '🌟 EXPERIENCIA',
  sticker: '🧸 STICKERS',
  anime: '🐲 ANIME',
  database: '🗄️ DATABASE',
  fix: '🛠️ FIX',
  grupo: '👥 GRUPOS',
  nable: '🔘 ON / OFF',
  descargas: '📥 DESCARGAS',
  youtube: '▶️ YOUTUBE',
  tools: '🧰 HERRAMIENTAS',
  info: '❕ INFO',
  nsfw: '🔥 NSFW',
  owner: '👮 OWNER',
  mods: '🛡️ STAFF',
  audio: '📼 AUDIOS',
  ai: '🤖 IA',
  transformador: '🔄 CONVERTIDORES',
}

const defaultMenu = {
  before: `
🎄🎅🎁✨✨✨✨✨✨✨🎁🎅🎄
❄️☃️  ¡FELIZ NAVIDAD!  ☃️❄️
🎄🎅🎁✨✨✨✨✨✨✨🎁🎅🎄

🎁✨ Hola *%name* ✨🎁
Soy *%me* 🤖🎄
%greeting ❄️☃️

🎄❄️ Que la magia navideña
🎅🎁 llene tu chat de comandos
☃️✨ y diversión sin límites ✨☃️

╔🎄════════════════════════════🎄╗
║ 🎅🎁 MENU NAVIDEÑO - %me 🎁🎅 ║
╠🎄════════════════════════════🎄╣
║ 🎄🤖 BOT: %me
║ 🎅👑 CREADOR: HUTAO
║ ❄️🌐 MODO: Público
║ 📱✨ BAILEYS: Multi Device
║ ⏰🎁 ACTIVO: %muptime
║ 👥❄️ USUARIOS: %totalreg
╚🎄════════════════════════════🎄╝

%readmore
╔❄️════════════════════════════❄️╗
║ 🎁☃️ PERFIL NAVIDEÑO ☃️🎁 ║
╠❄️════════════════════════════❄️╣
║ 🎄👤 USUARIO: %name
║ ⭐🎁 EXP: %exp
║ 🧑‍🎄📊 NIVEL: %level
║ 🏆❄️ RANGO: %role
╚❄️════════════════════════════❄️╝

%readmore
🎁🎄❄️════════════════════════════❄️🎄🎁
🎅✨ L I S T A  D E  C O M A N D O S ✨🎅
🎁🎄❄️════════════════════════════❄️🎄🎁
`.trimStart(),

  header: `
╔🎄══════════════════════════════🎄╗
║ 🎅❄️🎁  %category  🎁❄️🎅 ║
╚🎄══════════════════════════════🎄╝`,

  body: `║ 🎁🎄 %cmd ❄️🎅\n`,

  footer: `╚🎄══════════════════════════════🎄╝\n`,

  after: `
🎅🎄━━━━━━━━━━━━━━━━━━━━━━🎄🎅
🎁❄️ Gracias por usar *%me*
☃️✨ Que la Navidad ilumine tu chat
🎄🎁━━━━━━━━━━━━━━━━━━━━━━🎁🎄
> ${dev}`
}

let handler = async (m, { conn, usedPrefix: _p, __dirname }) => {
  try {
    let _package = JSON.parse(await promises.readFile(join(__dirname, '../package.json')).catch(_ => ({}))) || {}
    let { exp, estrellas, level, role } = global.db.data.users[m.sender]
    let { min, xp, max } = xpRange(level, global.multiplier)
    let name = await conn.getName(m.sender)

    let d = new Date(new Date + 3600000)
    let locale = 'es'
    let time = d.toLocaleTimeString(locale)
    let date = d.toLocaleDateString(locale)

    let _uptime = process.uptime() * 1000
    let muptime = clockString(_uptime)

    let totalreg = Object.keys(global.db.data.users).length

    let help = Object.values(global.plugins).filter(p => !p.disabled).map(p => ({
      help: Array.isArray(p.help) ? p.help : [p.help],
      tags: Array.isArray(p.tags) ? p.tags : [p.tags],
      prefix: 'customPrefix' in p,
      premium: p.premium
    }))

    conn.menu = defaultMenu

    let text = [
      defaultMenu.before,
      ...Object.keys(tags).map(tag => (
        defaultMenu.header.replace(/%category/g, tags[tag]) + '\n' +
        help.filter(m => m.tags.includes(tag)).map(m =>
          m.help.map(h =>
            defaultMenu.body.replace(/%cmd/g, m.prefix ? h : _p + h)
          ).join('')
        ).join('\n') +
        defaultMenu.footer
      )),
      defaultMenu.after
    ].join('\n')

    let replace = {
      p: _p,
      me: conn.getName(conn.user.jid),
      name,
      exp: exp - min,
      level,
      role,
      muptime,
      totalreg,
      greeting,
      readmore
    }

    text = text.replace(/%(\w+)/g, (_, k) => replace[k] || '')

    await m.react('🎄')

    await conn.sendMessage(
      m.chat,
      { text, mentions: [m.sender] },
      { quoted: m }
    )

  } catch (e) {
    conn.reply(m.chat, `❌ Error:\n${e}`, m)
  }
}

handler.help = ['menu']
handler.tags = ['main']
handler.command = ['menu', 'menú', 'help']
handler.group = true

export default handler

const more = String.fromCharCode(8206)
const readmore = more.repeat(4001)

function clockString(ms) {
  let h = Math.floor(ms / 3600000)
  let m = Math.floor(ms / 60000) % 60
  let s = Math.floor(ms / 1000) % 60
  return [h, m, s].map(v => v.toString().padStart(2, '0')).join(':')
}

var hour = new Date().getHours()
var greeting =
  hour < 6 ? '🌙 Buenas noches' :
  hour < 12 ? '☀️ Buenos días' :
  hour < 18 ? '🌇 Buenas tardes' :
  '🌌 Buenas noches'
