import fs, { promises } from 'fs'
import { join } from 'path'
import fetch from 'node-fetch'
import { xpRange } from '../lib/levelling.js'

let tags = {
  main: 'INFO-BOT 🤖',
  buscador: 'BUSCADORES 🔍',
  fun: 'JUEGOS 👾',
  jadibot: 'SER-BOT ⚡',
  rpg: 'R-P-G ⚔️',
  rg: 'REGISTRO 📩',
  xp: 'E-X-P 🌟',
  sticker: 'STICKERS 🐬',
  anime: 'ANIMES 🐲',
  database: 'DATA-BASE 🗄️',
  fix: 'FIX-MENSAJES 🛠️',
  grupo: 'GRUPOS 👥',
  nable: 'ON / OFF 🔘',
  descargas: 'DESCARGAS 📥',
  youtube: 'YOUTUBE ▶️',
  tools: 'HERRAMIENTAS 🧰',
  info: 'INFORMACION ❕',
  nsfw: 'NSFW 🔥',
  owner: 'CREADOR 👮🏻',
  mods: 'STAFF 🛡️',
  audio: 'AUDIOS 📼',
  ai: 'IA 🤖',
  transformador: 'CONVERTIDORES 🔄',
}

const defaultMenu = {
  before: `🎄❄️✨ FELIZ NAVIDAD ✨❄️🎄
╔════════════════════════════════╗
║ 🎅 BOT: %me 🎁
╚════════════════════════════════╝

🎄 Hola *%name* ❄️
Soy *%me*, %greeting

☃️ Que la nieve traiga comandos
🎁 y la Navidad magia al chat

╔════════════════════════════════╗
║     🎄 MENU NAVIDEÑO 🎄        ║
╠════════════════════════════════╣
║ 🎅 BOT: %me
║ 👑 CREADOR: HUTAO
║ 🌟 MODO: Público
║ 📱 BAILEYS: Multi Device
║ ⏱️ ACTIVO: %muptime
║ 👥 USUARIOS: %totalreg
╚════════════════════════════════╝

%readmore
╔════════════════════════════════╗
║     ❄️ PERFIL DEL USUARIO ❄️  ║
╠════════════════════════════════╣
║ 🎄 NOMBRE: %name
║ ⭐ EXP: %exp
║ 🎁 NIVEL: %level
║ 🏆 RANGO: %role
╚════════════════════════════════╝

%readmore
🎄══════════════════════════════🎄
   🎁 L I S T A  D E  C O M A N D O S 🎁
🎄══════════════════════════════🎄
`.trimStart(),

  header: `
╔══════════════════════════════╗
║ ❄️🎄  %category  🎄❄️ ║
╚══════════════════════════════╝`,

  body: `║ 🎁 %cmd\n`,

  footer: `╚══════════════════════════════╝\n`,

  after: `
🎅━━━━━━━━━━━━━━━━━━━━━━🎅
❄️ Bot %me activo con espíritu navideño
🎄 Que nunca falten comandos
🎁━━━━━━━━━━━━━━━━━━━━━━🎁
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
    let week = d.toLocaleDateString(locale, { weekday: 'long' })
    let date = d.toLocaleDateString(locale, { day: 'numeric', month: 'long', year: 'numeric' })
    let time = d.toLocaleTimeString(locale, { hour: 'numeric', minute: 'numeric', second: 'numeric' })

    let _uptime = process.uptime() * 1000
    let _muptime
    if (process.send) {
      process.send('uptime')
      _muptime = await new Promise(resolve => {
        process.once('message', resolve)
        setTimeout(resolve, 1000)
      }) * 1000
    }

    let muptime = clockString(_muptime)
    let totalreg = Object.keys(global.db.data.users).length

    let help = Object.values(global.plugins).filter(p => !p.disabled).map(p => ({
      help: Array.isArray(p.help) ? p.help : [p.help],
      tags: Array.isArray(p.tags) ? p.tags : [p.tags],
      prefix: 'customPrefix' in p,
      premium: p.premium
    }))

    conn.menu = {}
    let before = defaultMenu.before
    let header = defaultMenu.header
    let body = defaultMenu.body
    let footer = defaultMenu.footer
    let after = defaultMenu.after

    let text = [
      before,
      ...Object.keys(tags).map(tag =>
        header.replace(/%category/g, tags[tag]) + '\n' +
        help.filter(m => m.tags.includes(tag)).map(m =>
          m.help.map(h => body.replace(/%cmd/g, m.prefix ? h : _p + h)).join('')
        ).join('\n') +
        footer
      ),
      after
    ].join('\n')

    let replace = {
      p: _p, muptime, exp: exp - min, maxexp: xp,
      level, estrellas, role, name,
      me: conn.getName(conn.user.jid),
      totalreg, greeting
    }

    text = text.replace(/%(\w+)/g, (_, k) => replace[k] ?? `%${k}`)

    await m.react('🎄')

    const db = JSON.parse(fs.readFileSync('./src/db.json'))
    const vid = db.links.video[Math.floor(Math.random() * db.links.video.length)]

    await conn.sendMessage(m.chat, {
      video: { url: vid },
      caption: text.trim(),
      gifPlayback: true
    }, { quoted: m })

  } catch (e) {
    conn.reply(m.chat, `[ ✿ ] Error:\n${e}`, m)
  }
}

handler.help = ['menu']
handler.tags = ['main']
handler.command = ['menu', 'menú', 'help']
handler.group = true

export default handler

const more = String.fromCharCode(8206)
const readMore = more.repeat(4001)

function clockString(ms) {
  let h = Math.floor(ms / 3600000)
  let m = Math.floor(ms / 60000) % 60
  let s = Math.floor(ms / 1000) % 60
  return [h, m, s].map(v => v.toString().padStart(2, 0)).join(':')
}

var ase = new Date()
var hour = ase.getHours()
var greeting =
  hour < 6 ? 'Buenas noches 🌙' :
  hour < 12 ? 'Buenos días ☀️' :
  hour < 18 ? 'Buenas tardes 🌇' :
  'Buenas noches 🌌'
