const path = require('path');
const fse = require('fs-extra');
const spawn = require('cross-spawn-promise');
const fs = require('fs');
const Handlebars = require('handlebars');
const { getDir } = require('./../core/helpers');

const createSSL = domain => {
  const certOptions = [
    'certonly',
    '--standalone',
    '-d',
    domain,
    '--pre-hook',
    'service nginx stop',
    '--post-hook',
    'service nginx start',
  ];

  return spawn('certbot', certOptions, { stdio: 'inherit' });
};

const fillProxyTemplate = (templateFile, conf) => {
  const { domainName, port } = conf;
  const source = fs.readFileSync(templateFile).toString();
  const template = Handlebars.compile(source);
  return template({
    DOMAIN_NAME: domainName,
    SERVICE_PORT: port,
  });
};

const writeProxyFile = (file, content) => fse.outputFile(file, content);

const enableProxy = proxyFile => {
  const proxyName = path.basename(proxyFile);
  const NGINX_SITE = path.join('/etc/nginx/sites-enabled', proxyName);
  return spawn('ln', ['-sf', proxyFile, NGINX_SITE]);
};

const restartNginx = () => spawn('service', ['nginx', 'restart']);

/**
 * Proxy domain in nginx
 *   + Map site by proxy pass
 */
const mapNginx = conf => {
  const { domainName, name } = conf;
  const SERVICES = getDir('services');
  const SERVICE_DIR = path.join(SERVICES, name);
  const PROXY_TEMPLATE = path.join(__dirname, 'conf', 'sample', 'proxy.conf');
  const PROXY_NAME = `${name}-proxy.conf`;
  const PROXY_FILE = path.join(SERVICE_DIR, PROXY_NAME);

  return Promise.resolve()
    .then(() => fillProxyTemplate(PROXY_TEMPLATE, conf))
    .then(cf => writeProxyFile(PROXY_FILE, cf))
    .then(() => enableProxy(PROXY_FILE))
    .then(() => createSSL(domainName))
    .then(() => restartNginx());
};

module.exports = {
  mapNginx,
};

// Quick test
// const config = {
//   name: 'ebilling',
//   domainName: 'test.tinker.press',
//   port: 1234,
// };

// mapNginx(config).then(console.log);
