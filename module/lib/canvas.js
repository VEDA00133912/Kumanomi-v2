const { createCanvas, loadImage } = require('@napi-rs/canvas');
const fs = require('fs');
const path = require('path');

async function generateImageWithOverlay(uploadedImageUrl, overlayImagePath) {
  try {
    const background = await loadImage(uploadedImageUrl);
    const overlayBuffer = fs.readFileSync(overlayImagePath);
    const overlay = await loadImage(overlayBuffer);

    const canvas = createCanvas(background.width, background.height);
    const ctx = canvas.getContext('2d');

    ctx.drawImage(background, 0, 0);
    ctx.drawImage(overlay, 0, 0, background.width, background.height);

    return canvas.toBuffer('image/png');
  } catch (error) {
    console.error('画像の合成中にエラーが発生しました:', error);
    throw new Error('画像の合成に失敗しました');
  }
}

async function generateNews(uploadedImageUrl) {
  const overlayImagePath = path.resolve(__dirname, '../../file/assets/news.png');
  return generateImageWithOverlay(uploadedImageUrl, overlayImagePath);
}

async function generateKao(uploadedImageUrl) {
  const overlayImagePath = path.resolve(__dirname, '../../file/assets/kao.png');
  return generateImageWithOverlay(uploadedImageUrl, overlayImagePath);
}

// 共通処理: モノクロ化と色反転
async function processImage(uploadedImageUrl, processType) {
  try {
    const image = await loadImage(uploadedImageUrl);
    const canvas = createCanvas(image.width, image.height);
    const ctx = canvas.getContext('2d');
    ctx.drawImage(image, 0, 0);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    const processPixel = processType === 'mono' ? (i) => {
      const gray = 0.3 * data[i] + 0.59 * data[i + 1] + 0.11 * data[i + 2];
      data[i] = data[i + 1] = data[i + 2] = gray;
    } : (i) => {
      data[i] = 255 - data[i];
      data[i + 1] = 255 - data[i + 1];
      data[i + 2] = 255 - data[i + 2];
    };

    // ピクセル処理
    for (let i = 0; i < data.length; i += 4) {
      processPixel(i);
    }

    ctx.putImageData(imageData, 0, 0);
    return canvas.toBuffer('image/png');
  } catch (error) {
    console.error(`${processType}処理中にエラーが発生しました:`, error);
    throw new Error(`${processType}処理に失敗しました`);
  }
}

async function generateMono(uploadedImageUrl) {
  return processImage(uploadedImageUrl, 'mono');
}

async function generateInversion(uploadedImageUrl) {
  return processImage(uploadedImageUrl, 'inversion');
}

module.exports = { generateKao, generateNews, generateMono, generateInversion };
