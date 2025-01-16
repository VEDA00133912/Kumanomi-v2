const axios = require('axios');
const { gaster_API } = require('../../file/setting/url.json');  

async function convertToGaster(inputText) {
    if (!inputText?.trim()) throw new Error('変換する有効な文字列が必要です');
    
    try {
        if (!gaster_API) throw new Error('gaster_APIのURLが設定されていません');

        const response = await axios.post(gaster_API, { body: inputText });

        if (response.data.error) throw new Error(response.data.error);
        if (!response.data.transformed) throw new Error('APIから変換結果が返されませんでした');

        return response.data.transformed;
    } catch (error) {
        if (error.response) throw new Error(`APIエラー (${error.response.status}): ${error.response.data?.error || '不明なエラー'}`);
        if (error.request) throw new Error('APIに接続できませんでした');
        throw new Error(`内部エラー: ${error.message}`);
    }
}

module.exports = { convertToGaster };