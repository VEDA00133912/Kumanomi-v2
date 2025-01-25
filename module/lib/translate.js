const axios = require('axios');
const config = require('../../file/setting/url.json');

async function translater(text, source, target) {
  try {
    const response = await axios.get(config.translate_API, {
      params: {
        text,
        source,
        target
      }
    });

    if (response.data.includes('<link rel="shortcut icon" href="//ssl.gstatic.com/docs/script/images/favicon.ico"><title>Error</title>')) {
      return 'エラーが発生しました';
    }

    return response.data;
  } catch (error) {
    return '翻訳リクエスト中にエラーが発生しました';
  }
}

module.exports = { translater };