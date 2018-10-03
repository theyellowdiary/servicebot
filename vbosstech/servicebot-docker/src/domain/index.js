const axios = require('axios');
const { apiKey } = require('./config.json');

const _axios = axios.create({
  headers: { Authorization: `Bearer ${apiKey}` },
});

const mapDomain = ({ domainName }) => {
  // TODO: Load dynamic
  const hostIp = '13.228.244.186';
  const domain = 'vboss.tech';
  const tld = domainName.replace(`.${domain}`, '');
  const url = `https://api.digitalocean.com/v2/domains/${domain}/records`;

  return _axios
    .post(url, {
      type: 'A',
      name: tld,
      data: hostIp,
    })
    .then(res => console.log('[mapDomain]', res.data))
    .catch(console.log);
};

module.exports = {
  mapDomain,
};

const config = {
  domainName: `test-${Date.now()}.vboss.tech`,
};

// mapDomain(config)
//   .then(console.log)
//   .catch(console.log);
