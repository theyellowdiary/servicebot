const fs = require('fs');
const path = require('path');

const isValid = conf => Object.values(conf).reduce((carry, val) => carry && val, true);
const getDir = name => {
  // TODO: Using "cwd" isn't good practice
  const rootDir = process.cwd();
  return path.join(rootDir, name);
};
const getServiceConfs = () => {
  const servicesJson = getDir('services.json');
  return JSON.parse(fs.readFileSync(servicesJson).toString());
};

module.exports = {
  getDir,
  isValid,
  getServiceConfs,
};
