const core = require('@actions/core');
const exec = require('@actions/exec');
const configure = require('./configure.js');

function validate() {
  if (core.getInput('release_channel') && core.getInput('cluster_version')) {
    throw new Error('At most one of --release-channel | --cluster-version may be specified');
  }
  if (core.getInput('create') && !core.getInput('name')) {
    throw new Error('If \'create\' is true, then \'name\' must be provided');
  }
}

async function create() {
  try {
    const name = core.getInput('name');
    const args = [
      name,
      '--machine-type', core.getInput('machine_type'),
      '--num-nodes', core.getInput('num_nodes'),
    ];
    if (core.getInput('release_channel')) {
      args.push('--release-channel', core.getInput('release_channel'));
    }
    if (core.getInput('cluster_version')) {
      args.push('--cluster-version', core.getInput('cluster_version'));
    }
    if (core.getInput('preemptible') === 'true') {
      args.push('--preemptible');
    }
    if (core.getInput('enable_network_policy') === 'true') {
      args.push('--enable-network-policy');
    }
    if (core.getInput('enable_stackdriver') === 'false') {
      args.push('--no-enable-stackdriver-kubernetes');
    }
    if (core.getInput('enable_basic_auth') === 'false') {
      args.push('--no-enable-basic-auth');
    }
    if (core.getInput('enable_legacy_auth') === 'false') {
      args.push('--no-enable-legacy-authorization');
    }

    // Needs beta in order to use --release-channel
    await exec.exec('gcloud beta container clusters create', args);

    await exec.exec('gcloud config set container/cluster', [name]);
    await exec.exec('gcloud container clusters get-credentials', [name]);

    let sa;
    await exec.exec('gcloud config get-value account', [], {
      listeners: {
        stdout: (data) => {
          sa = data.toString();
        },
      },
    });
    await exec.exec('kubectl create clusterrolebinding ci-cluster-admin --clusterrole=cluster-admin',
      ['--user', sa]);
  } catch (e) {
    core.setFailed(e.message);
  }
}

async function run() {
  try {
    await configure();
    if (core.getInput('create') === 'true') {
      await create();
    }
  } catch (e) {
    core.setFailed(e.message);
  }
}

try {
  validate();
  run();
} catch (e) {
  core.setFailed(e.message);
}
