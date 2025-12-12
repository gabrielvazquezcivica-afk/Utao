let handler = async (m, { conn, args, participants, usedPrefix, command }) => {

    if (!args[0]) return conn.reply(
        m.chat,
        `🚩 *Uso correcto:*\n${usedPrefix + command} <tema>\n\n*Ejemplo:*\n${usedPrefix + command} memes`,
        m
    )

    let tema = args.join(" ")

    let users = participants.map(v => v.id).filter(v => v !== conn.user.jid)

    if (users.length < 1) return conn.reply(m.chat, "❌ No hay suficientes usuarios para hacer un top.", m)

    // Mezclar usuarios
    users = users.sort(() => Math.random() - 0.5)

    // Tomar 10
    let top = users.slice(0, 10)

    // Emojis aleatorios
    const emojis = [
        "🔥","💀","😂","💎","😎","🤡","🥵","🤖","✨","🐒",
        "🎉","🧨","🚀","🌟","🍺","📌","💥","🤑","🎭","👻",
        "💕","⚡","🍕","😈","🎶","🎯","🎮","🐱","🎁","📸"
    ]

    let randomEmojis = emojis.sort(() => Math.random() - 0.5).slice(0, 7)

    // Medallas
    const medallas = ["🥇","🥈","🥉"]

    let texto = `╭━━━〔 *🏆 TOP ${tema.toUpperCase()} 🏆* 〕━━━╮
┃
┃ ✨ *Ranking legendario generado...*  
┃   *Solo los mejores entraron aquí* 😎
┃
┣━━━━━━━━━━━━━━━━━━━━━━┫
`

    for (let i = 0; i < top.length; i++) {

        let emoji = i < 3 ? medallas[i] : randomEmojis[i - 3]

        texto += `┃ ${i + 1}° ${emoji} → @${top[i].split("@")[0]}\n`
    }

    texto += `┣━━━━━━━━━━━━━━━━━━━━━━┫
┃ 📌 *Comando:* ${usedPrefix + command} ${tema}
╰━━━━━━━━━━━━━━━━━━━━━━╯`

    await conn.reply(m.chat, texto, m, { mentions: top })
    await conn.sendMessage(m.chat, { react: { text: "✔️", key: m.key } })
}

handler.help = ['top <tema>']
handler.tags = ['fun']
handler.command = /^top$/i
handler.group = true

export default handler
