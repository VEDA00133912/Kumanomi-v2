const axios = require('axios');
const JSZip = require('jszip');
const fs = require('fs');
const path = require('path');

const createEmojiZip = async (guild) => {
  const emojis = guild.emojis.cache;

  if (emojis.size === 0) {
    return null;  
  }

  const zip = new JSZip();
  const emojiPromises = [];

  emojis.forEach((emoji) => {
    let emojiURL = emoji.imageURL({ size: 2048 });
    if (emoji.animated) {
      emojiURL = emojiURL.replace('.webp', '.gif');
    }

    emojiPromises.push(
      axios.get(emojiURL, { responseType: 'arraybuffer' }).then((response) => {
        const fileName = `${emoji.name}.${emoji.animated ? 'gif' : 'png'}`;
        zip.file(fileName, response.data, { binary: true });
      }).catch((error) => {
        console.error(`絵文字 ${emoji.name} のダウンロードに失敗しました。`, error);
      })
    );
  });

  try {
    await Promise.all(emojiPromises);

    const zipBuffer = await zip.generateAsync({ type: 'nodebuffer' });
    const zipFileName = `${guild.name}-Emoji.zip`; 
    const zipFilePath = path.join(__dirname, zipFileName);

    fs.writeFileSync(zipFilePath, zipBuffer);
    return zipFilePath;  
  } catch (error) {
    console.error('ZIPファイルの生成に失敗しました。', error);
    return null;
  }
};

module.exports = { createEmojiZip };