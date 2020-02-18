const core = require('@actions/core');
const exec = require('@actions/exec');
const util = require('util');
const configure = require('./configure.js');

const sleep = util.promisify(setTimeout);

async function destroy() {
  let name;
  try {
    name = core.getInput('name').replace(/\./g, '-');
    await exec.exec('gcloud container clusters delete --quiet', [name]);
  } catch (e1) {
    core.warning('error deleting cluster; attempting again in 10 minutes: ' + e1.message);
    try {
      await sleep(60*10*1000);
      await exec.exec('gcloud container clusters delete --quiet', [name]);
    } catch (e2) {
      core.setFailed(e2.message);
    }
  }
}

async function run() {
  try {
    if (core.getInput('create') === 'true' && core.getInput('clean_up') === 'true') {
      await configure();
      await destroy();
    }
  } catch (e) {
    core.setFailed(e.message);
  }
}

try {
  run();
} catch (e) {
  core.setFailed(e.message);
}
