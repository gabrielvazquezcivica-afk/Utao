const handler = async (m, { conn, participants, usedPrefix, command }) => {
  const emojis = [
    "🔥","💥","⚡","🌟","⭐","✨","💫","🌈","☀️","🌙","🍀","🍙","🍩","🍪",
    "🎉","🎊","🎈","🎁","🏆","🎯","🚀","🛸","🐶","🐱","🐭","🐹","🐰","🦊",
    "🐻","🐼","🐨","🐯","🦁","🐮","🐸","🐵","🦄","🐺","🐙","🐠","🐬","🐳",
    "🌹","🌷","🌸","🌼","🌻","🍁","🍄","⚙️","🧩","🎮","🕹️","📱","💻","💡"
  ];

  const getRandomEmoji = () => emojis[Math.floor(Math.random() * emojis.length)];

  let message = `*MENCIO GENERAL 🌟* \n\nMensajes para todos:\n\n`;

  for (let mem of participants) {
    const emoji = getRandomEmoji();
    message += `${emoji} @${mem.id.split('@')[0]}\n`;
  }

  conn.sendMessage(m.chat, { text: message, mentions: participants.map(a => a.id) }, { quoted: m });
};

handler.help = ['tagall'];
handler.tags = ['group'];
handler.command = /^(tagall|todos|here)$/i;
handler.admin = true;
handler.group = true;

export default handler;
