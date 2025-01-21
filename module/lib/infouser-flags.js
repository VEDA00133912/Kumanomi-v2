const axios = require('axios');
const config = require('../../file/setting/url.json');

async function getUserPublicFlags(userId) {
    try {
        const response = await axios.get(`${config.userflaggs_API}${userId}`);
        return response.data.data.public_flags_array;
    } catch (error) {
        console.error('バッジ情報の取得中にエラーが発生しました:', error);
        return []; 
    }
}

module.exports = getUserPublicFlags;