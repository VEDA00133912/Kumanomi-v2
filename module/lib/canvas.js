const { createCanvas, loadImage } = require('@napi-rs/canvas');
const fs = require('fs');
const path = require('path');

async function generateMeme(uploadedImageUrl) {
  const overlayImagePath = path.resolve(__dirname, '../../file/assets/kao.png');

  try {
    const background = await loadImage(uploadedImageUrl);  
    const overlayBuffer = fs.readFileSync(overlayImagePath);
    const overlay = await loadImage(overlayBuffer);

    const canvas = createCanvas(background.width, background.height);
    const ctx = canvas.getContext('2d');

    ctx.drawImage(background, 0, 0);
    ctx.drawImage(overlay, 0, 0, background.width, background.height);  

    const buffer = canvas.toBuffer('image/png');

    return buffer;  
  } catch (error) {
    console.error('画像の合成中にエラーが発生しました:', error);
    throw new Error('画像の合成に失敗しました');  
  }
}

module.exports = { generateMeme };