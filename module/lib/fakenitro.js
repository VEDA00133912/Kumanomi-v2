const crypto = require('crypto');

function generateNitroLinks(quantity, type) {
  const baseUrl = type === 'nitro' ? 'https://discord.gift/' : 'https://discord.com/billing/promotions/';
  const length = type === 'nitro' ? 16 : 24;
  const nitroLinks = [];

  for (let i = 0; i < quantity; i++) {
    let code = crypto.randomBytes(length).toString('base64').slice(0, length);

    if (type === 'promo') {
      code = code.match(/.{1,4}/g).join('-');
    }

    nitroLinks.push(`${baseUrl}${code}`);
  }

  return nitroLinks;
}

module.exports = { generateNitroLinks };