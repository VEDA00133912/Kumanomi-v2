const axios = require('axios');
const config = require('../../file/setting/api.json');

async function convertText(type, text) {
  const conversionFunctions = {
    'rune': () => convertWithAPI('rune', text),
    'gaster': () => convertWithAPI('gaster', text),
    'backword': () => text.split('').reverse().join(''),
    'anagram': () => text.split('').sort(() => Math.random() - 0.5).join(''),
  };

  return conversionFunctions[type] ? await conversionFunctions[type]() : 'エラーが発生しました。';
}

async function convertWithAPI(type, text) {
  try {
    const { data } = await axios.get(`${config.main_API}/${type}/${text}`);
    return data.status === 200 ? data.transformatedText : 'エラーが発生しました。';
  } catch (error) {
    return 'エラーが発生しました。';
  }
}

module.exports = { convertText };
