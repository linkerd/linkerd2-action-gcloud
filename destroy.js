const core = require('@actions/core');
const exec = require('@actions/exec');
const configure = require('./configure.js');

async function destroy() {
  try {
    const name = core.getInput('name').replace(/\./g, '-');
    await exec.exec('gcloud container clusters delete --quiet', [name]);
  } catch (e) {
    core.setFailed(e.message);
  }
}

async function run() {
  try {
    if (core.getInput('create') === 'true' && core.getInput('clean_up') === true) {
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
