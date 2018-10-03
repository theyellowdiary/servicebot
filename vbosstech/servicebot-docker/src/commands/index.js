const program = require('commander');
const os = require('os');
const spawn = require('cross-spawn-promise');
const path = require('path');
const fse = require('fs-extra');
const fs = require('fs');
const Handlebars = require('handlebars');

const { getDir, isValid, getServiceConfs } = require('../core/helpers');
const { mapNginx } = require('./../nginx');
const { mapDomain } = require('./../domain');

// Support funcs
const enhanceConf = conf => conf && { ...conf, port: conf.SERVICE_PORT };
const cloneSource = (repo, service, { at: cwd }) => spawn('git', ['clone', repo, service], { stdio: 'inherit', cwd });
const fillYamlTemplate = (templatePath, data) => {
  const source = fs.readFileSync(templatePath).toString();
  const template = Handlebars.compile(source);
  return template(data);
};
const writeYamlFile = (file, content) => fse.outputFile(file, content);
const runDocker = ({ at: cwd }) => spawn('docker-compose', ['up', '-d', '--build'], { stdio: 'inherit', cwd });

/**
 * Deploy service base on:
 *   + Dockerfile
 *   + Env file
 *   + Yaml file
 * @param {*} service
 * @returns
 */
const service = async service => {
  const serviceConfs = getServiceConfs();
  const _conf = serviceConfs.filter(conf => conf.name === service)[0];
  const conf = enhanceConf(_conf);

  if (!conf) {
    console.log(`Please provide "config" for service ${service} in "services.config.js"`);
    return;
  }

  if (!isValid(conf)) {
    console.log(`Please provide ALL "config" for service ${service} in "services.config.js"`);
    return;
  }

  /*
    + Clone source
    + Template + data => docker-compose.yaml
    + Run docker
    + Map nginx
  */
  const { repo, docker_file, docker_compose, name } = conf;
  const SERVICES = getDir('services');
  const SERVICE_DIR = path.join(SERVICES, name);
  const DOCKER_TEMPLATE = getDir(docker_file);
  const DOCKER_FILE = path.join(SERVICE_DIR, 'Dockerfile');
  const YAML_TEMPLATE = getDir(docker_compose);
  const YAML_FILE = path.join(SERVICE_DIR, 'docker-compose.yaml');

  fse
    .remove(SERVICE_DIR)
    .then(() => cloneSource(repo, SERVICE_DIR, { at: SERVICES }))
    .then(() => fse.copy(DOCKER_TEMPLATE, DOCKER_FILE))
    .then(() => fillYamlTemplate(YAML_TEMPLATE, conf))
    .then(ct => writeYamlFile(YAML_FILE, ct))
    .then(() => mapNginx(conf))
    .then(() => runDocker({ at: SERVICE_DIR }))
    .catch(err => {
      console.log('Fail to deploy. Err', err.message);
    });
};

const domain = domainName => mapDomain({ domainName });

program
  .command('service <service>')
  .description(['Install service', '  + service: Service name in services.json', ''].join(os.EOL))
  .action(service);

program
  .command('domain <domain>')
  .description(['Map domain', '  + domain: Service\'s domain', ''].join(os.EOL))
  .action(domain);

program
  .version('0.0.1')
  .usage('./vboss [command] [option]')
  .description('Utils deploy service');

const commands = () => {
  program.parse(process.argv);
};

module.exports = {
  commands,
};
