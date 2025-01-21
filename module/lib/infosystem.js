const os = require('os');

function getSystemInfo() {
  return {
    uptime: os.uptime(),
    freemem: os.freemem(),
    totalmem: os.totalmem(),
    cpus: os.cpus(),
    arch: os.arch(),
  };
}

module.exports = { getSystemInfo };