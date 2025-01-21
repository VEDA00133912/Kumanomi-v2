const axios = require('axios');
const config = require('../../file/setting/url.json');

async function checkRedirect(url) {
    try {
        const response = await axios.get(`${config.redirect_API}redirectChecker?url=${encodeURIComponent(url)}`);
        if (!response.data.length) return { error: "取得に失敗しました。サイトに到達できていない可能性があります。" };

        return response.data.map(item => ({ url: item.url }));
    } catch (error) {
        console.error(error);
        return { error: "API呼び出し中にエラーが発生しました。" };
    }
}

module.exports = { checkRedirect };