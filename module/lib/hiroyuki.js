const fs = require('fs').promises;
const axios = require('axios');
const path = require('path');

const generateAudio = async (text, interaction) => {
  const url = 'https://plbwpbyme3.execute-api.ap-northeast-1.amazonaws.com/production/coefonts/19d55439-312d-4a1d-a27b-28f0f31bedc5/try';
  const headers = { 'Content-Type': 'application/json' };
  const data = { text };

  const dirPath = path.join(__dirname, '..', '..', 'file', 'hiroyuki');
  const audioFilePath = path.join(dirPath, `hiroyuki_${interaction.id}.mp3`);

  try {
    await fs.mkdir(dirPath, { recursive: true });

    const response = await axios.post(url, data, { headers });

    const audioUrl = response.data?.location;

    const audioResponse = await axios.get(audioUrl, { responseType: 'arraybuffer' });
    if (audioResponse.status === 200) {
      await fs.writeFile(audioFilePath, Buffer.from(audioResponse.data));
      return audioFilePath; 
    }
  } catch (error) {
    throw new Error('<:error:1299263288797827185> 音声の生成に失敗しました。\nNGワードが含まれているか、サーバーが混雑しています。');
  }

  return null;
};

const deleteAudioFile = async (filePath) => {
  try {
    await fs.unlink(filePath);
  } catch (error) {
    console.error(`ファイル削除エラー: ${error}`);
  }
};

module.exports = { generateAudio, deleteAudioFile };