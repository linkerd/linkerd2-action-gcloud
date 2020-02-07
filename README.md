# Github action to configure `gcloud` and create/destroy GKE clusters on demand

This github action configures the `gcloud` CLI already present in the github action runner VM. If `create` is true, it also creates a GKE cluster that is automatically torn down after the job finishes (through a "post" hook).

## Usage

```yaml
- uses: linkerd2/linkerd2-actions-gcloud@v1
  with:
    # Your GCP service account key. REQUIRED.
    cloud_sdk_service_account_key: ${{ secrets.CLOUD_SDK_SERVICE_ACCOUNT_KEY }}
    # The name of the GCP project under which clusters will be deployed. REQUIRED.
    gcp_project: some-project
    # GCP zone for the cluster. REQUIRED.
    gcp_zone: us-central1-b
    # Set to true to create a new cluster which will be destroyed after the job finishes. Leave empty to just configure the gcloud tooling.
    create: true
    # Set to true to delete the cluster after the test finishes. Defaults to true.
    clean_up: true
    # Cluster name; required only if 'create' is true.
    name: foobar
    # Machine type. Defaults to n1-standard-2
    machine_type: n1-standard-2
    # Number of worker nodes. Defaults to 1.
    num_nodes: 1
    # The release channel determines the Kubernetes version to use. Defaults to 'rapid'. Can't be used alongside cluster_version.
    release_channel: rapid
    # The Kubernetes version to use. Can't be used alongside cluster_version.
    cluster_version: 1.16
    # Creates a preemptible cluster. Defaults to true.
    preemptible: true
    # Enables network policy (through Calico). Defaults to true.
    enable_network_policy: true
    # Enables StackDriver monitoring. Defaults to false.
    enable_stackdriver: false
    # Enables basic authorization. Defaults to false.
    enable_basic_auth: false
    # Enables legacy authorization. Defaults to false.
    enable_legacy_auth: false

```

## License

Copyright 2020, Linkerd Authors. All rights reserved.

Licensed under the Apache License, Version 2.0 (the "License"); you may not use
these files except in compliance with the License. You may obtain a copy of the
License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed
under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
CONDITIONS OF ANY KIND, either express or implied. See the License for the
specific language governing permissions and limitations under the License.
