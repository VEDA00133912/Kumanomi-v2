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

async function generateNews(uploadedImageUrl) {
  const overlayImagePath = path.resolve(__dirname, '../../file/assets/news.png');

  try {
    // 背景画像を読み込み
    const background = await loadImage(uploadedImageUrl);  

    // オーバーレイ画像を読み込み
    const overlayBuffer = fs.readFileSync(overlayImagePath);
    const overlay = await loadImage(overlayBuffer);

    // オーバーレイ画像のサイズに合わせて背景画像をリサイズ
    const overlayWidth = overlay.width;
    const overlayHeight = overlay.height;

    // 縦横比を保ちながら背景画像をリサイズ
    const aspectRatio = background.width / background.height;
    let newWidth, newHeight;

    if (overlayWidth / overlayHeight > aspectRatio) {
      newWidth = overlayWidth;
      newHeight = Math.round(newWidth / aspectRatio);
    } else {
      newHeight = overlayHeight;
      newWidth = Math.round(newHeight * aspectRatio);
    }

    // リサイズされた背景画像
    const resizedBackground = await createCanvas(newWidth, newHeight);
    const ctx = resizedBackground.getContext('2d');
    ctx.drawImage(background, 0, 0, newWidth, newHeight);

    // 新しいキャンバスで合成
    const canvas = createCanvas(newWidth, newHeight);
    const ctx2 = canvas.getContext('2d');

    ctx2.drawImage(resizedBackground, 0, 0);

    // オーバーレイ画像を中心に配置
    const centerX = (newWidth - overlayWidth) / 2;
    const centerY = (newHeight - overlayHeight) / 2;
    ctx2.drawImage(overlay, centerX, centerY, overlayWidth, overlayHeight);  

    // 合成した画像をバッファに変換
    const buffer = canvas.toBuffer('image/png');

    return buffer;  
  } catch (error) {
    console.error('画像の合成中にエラーが発生しました:', error);
    throw new Error('画像の合成に失敗しました');  
  }
}

module.exports = { generateMeme, generateNews };