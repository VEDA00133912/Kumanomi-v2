const isValidUrl = (string) => /^(https?:\/\/)?([a-zA-Z0-9.-]+)\.[a-zA-Z]{2,}([\/\w .-]*)*\/?$/.test(string);
const invalidUrlMessage = () => '<:error:1302169165905526805> 無効なURLです。正しい形式で入力してください。';

module.exports = { isValidUrl, invalidUrlMessage };