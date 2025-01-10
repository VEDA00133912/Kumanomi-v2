const axios = require('axios');
const JSZip = require('jszip');
const fs = require('fs');
const path = require('path');

async function downloadEmojisToZip(guild, emojis) {
  const zip = new JSZip();
  const emojiPromises = [];

  emojis.forEach((emoji) => {
    const emojiURL = emoji.imageURL({ size: 1024 });
    
    emojiPromises.push(
      axios.get(emojiURL, { responseType: 'arraybuffer' }).then((response) => {
        const fileName = `${emoji.name}.${emoji.animated ? 'gif' : 'png'}`;
        zip.file(fileName, response.data);
      }).catch((error) => {
        console.error(`絵文字 ${emoji.name} のダウンロードに失敗しました。`, error);
      })
    );
  });

  await Promise.all(emojiPromises);

  const zipFileName = `${guild.name}-Emoji.zip`;
  const filePath = path.join(__dirname, '../../file/assets', zipFileName);
  const content = await zip.generateAsync({ type: 'nodebuffer' });

  fs.writeFileSync(filePath, content);
  return filePath;
}

module.exports = { downloadEmojisToZip };