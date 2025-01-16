const axios = require('axios');
const config = require('../../file/setting/url.json');
async function translater(text, source, target) {
  return axios.get(config.translate_API, {
    params: {
      text,
      source, 
      target
    }
  })
  .then(response => {
    return response.data;
  })
  .catch(error => {
    throw error;
  });
}

module.exports = { translater };