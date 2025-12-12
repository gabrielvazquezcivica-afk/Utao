import pkg from 'canvas';
const { createCanvas, loadImage } = pkg;
import axios from 'axios';

let handler = async (m, { conn, text }) => {
  if (!text) return m.reply('⚠️ Escribe el texto del quote.\nEjemplo:\n.qc Hola grupo ❤️');

  await m.react('⏳');
  
  try {
    let name = m.pushName || "Usuario";
    let avatarURL = await conn.profilePictureUrl(m.sender, "image")
      .catch(_ => "https://telegra.ph/file/24fa902ead26340f3df2c.png");

    let avatar = await loadImage((await axios.get(avatarURL, { responseType: "arraybuffer" })).data);

    // Canvas
    const width = 800;
    const height = 400;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext("2d");

    // Fondo
    ctx.fillStyle = "#1f1f1f";
    ctx.fillRect(0, 0, width, height);

    // Avatar circular
    const size = 120;
    ctx.save();
    ctx.beginPath();
    ctx.arc(90, 90, 60, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(avatar, 30, 30, size, size);
    ctx.restore();

    // Nombre
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 30px Sans-serif";
    ctx.fillText(name, 170, 80);

    // Texto del quote
    ctx.font = "26px Sans-serif";
    wrapText(ctx, text, 170, 140, 600, 34);

    // Generar buffer final
    let buffer = canvas.toBuffer();

    await conn.sendFile(m.chat, buffer, "quote.png", "", m);
    await m.react('✅');

  } catch (e) {
    console.log(e);
    await m.reply("❌ Ocurrió un error generando la imagen.");
    await m.react('✖️');
  }
};

function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
  const words = text.split(" ");
  let line = "";
  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + " ";
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxWidth && n > 0) {
      ctx.fillText(line, x, y);
      line = words[n] + " ";
      y += lineHeight;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line, x, y);
}

handler.command = ["qc", "quote"];
export default handler;
