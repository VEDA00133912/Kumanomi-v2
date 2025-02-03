const axios = require('axios');
const config = require('../../file/setting/url.json');  

async function getPackageInfo(packageName) {
  try {
    const { data } = await axios.get(`${config.npmURL}${packageName}`);
    const latestVersion = data['dist-tags'].latest;
    const { license, author, homepage, repository } = data.versions[latestVersion];

    return {
      name: data.name,
      version: latestVersion,
      license: license || '不明',
      author: author?.name || '不明',
      homepage: homepage || 'なし',
      repository: repository?.url || 'なし',
      lastPublish: new Date(data.time[latestVersion]).toLocaleString('ja-JP')
    };
  } catch {
    throw new Error('<:error:1302169165905526805> 指定されたパッケージが見つかりませんでした');
  }
}

module.exports = { getPackageInfo };