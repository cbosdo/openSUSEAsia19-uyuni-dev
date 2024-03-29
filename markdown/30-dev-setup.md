<!-- .slide: data-state="section-break" id="dev-setup" data-menu-title="Development Setup" data-timing="15" -->
# Development Environment Setup

Note:
Agenda:
* Installing and setting up Eclipse
* Get the sources, import and build them
* Sumaform
* Running Tests
* Test packages in OBS


<!-- .slide: data-state="normal" id="eclipse-setup" data-menu-title="Setting up Eclipse" data-timing="60" -->
## Setting Up Eclipse

Eclipse Download page:

<a title="Eclipse Download Page"
  href="https://www.eclipse.org/downloads/packages/">
  <img alt="Eclipse download page screenshot" data-src="images/eclipse-download.png" class="hcenter"/>
</a>

Plugins: <!-- .element class="fragment" -->

<div class="container">
  <div class="item">
    <figure class="fragment">
      <a href="http://ant.apache.org/ivy/ivyde/download.cgi">
        <img data-src="images/ivy-logo.png" alt="Ivy Logo" />
      </a>
    </figure>
  </div>
  <div class="item">
    <figure class="fragment">
      <a href="https://checkstyle.org/eclipse-cs/#!/install">
        <img data-src="images/checkstyle-logo.png" alt=" Logo" />
      </a>
    </figure>
  </div>
</div>

Note:
* *Disclaimer: I am an Eclipse user! other possible IDEs*
* Using Neovim for non-Java code
* Explain the plugins


<!-- .slide: data-state="normal" id="getting-sources" data-menu-title="Getting the Sources" data-timing="60" -->
## Getting the Sources

```bash
git clone https://github.com/uyuni-project/uyuni/
```

```bash
cd uyuni/java
ant make-eclipse-project
```

*File* > *Import* > *General* > *Existing Projects into Workspace*

<img data-src="images/import-projects.png" alt="Import projects dialog"
 class="hcenter" style="width: 30%"/>


<!-- .slide: data-state="normal" id="checkstyle-setup" data-menu-title="Checkstyle Setup" data-timing="60" -->
## Checkstyle Setup

* In *Window* > *Preferences* > *Checkstyle* > *New*
	* Internal Configuration
	* Name: *Uyuni*
	* Import `conf/eclipse/checkstyle_eclipse.xml`

<img data-src="images/checkstyle-config.png" alt="Checkstyle setup dialog"
 class="hcenter" style="width: 40%"/>


<!-- .slide: data-state="normal" id="dev-wiki-link" data-menu-title="Development Wiki Link" data-timing="15" -->

<div class="qrcode" id="qrcode-wiki" />
<a href="https://github.com/uyuni-project/uyuni/wiki"
   id="wiki">
  https://github.com/uyuni-project/uyuni/wiki
</a>

Note:
Ask if they want to get the link now.


<!-- .slide: data-state="normal" id="building" data-menu-title="Building" data-timing="120" -->
## Building

```bash
zypper ar http://download.opensuse.org/... systemsmanagement:Uyuni:Utils
```
<!-- .element class="fragment" -->

```bash
zypper in java-11-openjdk-devel apache-ivy ant ant-junit servletapi5 \
    obs-to-maven
```
<!-- .element class="fragment" -->

```bash
ant -f manager-build.xml ivy
```
<!-- .element class="fragment" -->

One of:
<!-- .element class="fragment" -->

* <!-- .element class="fragment" -->
  `precompile = true` in `buildconf/manager-developer-build.properties`
* <!-- .element class="fragment" -->
  `ant -f manager-build.xml webapp`

<a href="https://github.com/uyuni-project/uyuni/wiki/Java-Development-Environment">
  https://github.com/uyuni-project/uyuni/wiki/Java-Development-Environment
</a>
<!-- .element class="fragment" -->

Note:
* Explain obs-to-maven
* Reuse Eclipse build
* ant deploy target


<!-- .slide: data-state="normal" id="sumaform" data-menu-title="Sumaform" data-timing="120" -->
## Sumaform

 ```bash
zypper ar http:// systemsmanagement:terraform
 ```
<!-- .element: id="add-terraform-repo" class="fragment" -->

```bash
zypper in terraform-provider-libvirt
```
<!-- .element: id="install-terraform" class="fragment" -->

```bash
git clone https://github.com/uyuni-project/sumaform
```
<!-- .element: id="clone-sumaform" class="fragment" -->

* Create main.tf
<!-- .element: id="create-main-tf" class="fragment" -->

```bash
terraform init
terraform apply --auto-approve
```
<!-- .element: id="deploy" class="fragment" -->

* Wait!
<!-- .element: id="wait-deploy" class="fragment" -->

Note:
* Explain what terraform is?
* temporary branch to use: testsuite-stable-with-new-fake-repos


<!-- .slide: data-state="normal" id="main-rf-example" data-menu-title="main.tf example" data-timing="60" -->
## main.tf

```c
provider "libvirt" {
  uri = "qemu:///system"
}

module "base" {
  source = "./modules/libvirt/base"

  cc_username = ""
  cc_password = ""

  name_prefix = "dev-"
  images = ["opensuse151"]
}
```

Note:
* mention the example main.tf
* optimization:
    * mirror
    * use_shared_resources = true


<!-- .slide: data-state="normal" id="main-rf-example-srv" data-menu-title="main.tf example - Server" data-timing="30" -->
## main.tf - Server

```c
module "srv" {
  source = "./modules/libvirt/suse_manager"
  base_configuration = "${module.base.configuration}"
  product_version = "uyuni-master"
  name = "srv"
  image = "opensuse151"
  use_os_released_updates = true
  auto_accept = false
  skip_changelog_import = false
  browser_side_less = false
  mgr_sync_autologin = false
  create_sample_channel = false
  create_sample_activation_key = false
  create_sample_bootstrap_script = false
  publish_private_ssl_key = false
  java_debugging = true
  ssh_key_path = "./salt/controller/id_rsa.pub"
}
```


<!-- .slide: data-state="normal" id="main_tf_minion" data-menu-title="main.tf example - Minion" data-timing="30" -->
## main.tf example - Minion

```c
module "minion" {
  source = "./modules/libvirt/minion"
  base_configuration = "${module.base.configuration}"
  server_configuration = "${module.srv.configuration}"
  product_version = "uyuni-master"
  name = "minion"
  image = "opensuse151"
  auto_connect_to_master = true
  ssh_key_path = "./salt/controller/id_rsa.pub"
  memory = 512
}
```

Note:
* More modules (KVM host, proxy...)


<!-- .slide: data-state="normal" id="running-unit-tests" data-menu-title="Running Unit Tests" data-timing="120" -->
## Running Unit Tests

<div class="fragment">
<p>
Building the test containers
</b>

<pre><code class="hljs bash" data-trim data-noescape>
sudo systemctl start docker
cd uyuni/susemanager-utils/testing/docker/master
make public_containers
</code></pre>
</div>

<div class="fragment">
<p>
Running the unit tests
</p>

<pre><code class="hljs bash" data-trim data-noescape>
cd uyuni/java
make -f Makefile.docker dockerrun_pg
mkdir -p /var/log/rhn/
mkdir -p /srv/susemanager
</code></pre>
</div>

<div class="fragment">
<p>
Junit3 Run Configuration
</p>

<pre><code class="hljs bash" data-trim data-noescape>
-Drhn.config.dir=${workspace_loc:spacewalk-java}/buildconf/test/
-Dlog4j.threshold=debug
</code></pre>
</div>

`ant -f manager-build.xml test`
<!-- .element class="fragment" -->

Note:
* In Eclipse: run tests separately


<!-- .slide: data-state="normal" id="cucumber-tests" data-menu-title="Cucumber Tests" data-timing="120" -->
## Cucumber Tests

* <!-- .element class="fragment" -->
  UI / integration tests
* <!-- .element class="fragment" -->
  Ruby + [cucumber](https://cucumber.io/docs)
* <!-- .element class="fragment" -->
  Special Sumaform setup
    * `terraform workspace --help`
    * `ln -s main.tf main.tf.test`
    * Controller
    * Test client + minion
* <!-- .element class="fragment" -->
  On the controller VM:
    * Edit `spacewalk/testsuite/run_sets/testsuite.yml`
    * `run-testsuite`
    * `cucumber spacewalk/testsuite/features/my_feature.feature`


<!-- .slide: data-state="normal" id="test-packages" data-menu-title="Test Packages with OBS" data-timing="120" -->
## Test Packages using OBS

* <!-- .element id="branch-obs-master" class="fragment" -->
  Branch a package in `systemsmanagement:Uyuni:Master`

```bash
export OSCAPI=https://api.opensuse.org
export OBS_PROJ=home:you:branches:systemsmanagement:Uyuni:Master
export TEST=--test
cd uyuni/rel-eng
./build-packages-for-obs.sh && ./push-packages-to-obs.sh
```
<!-- .element id="push-to-obs-test" class="fragment" -->

* <!-- .element id="wait-obs" class="fragment" -->
  Wait for green build

```c
product_test_repository="https://download.opensuse.org/repositories/home:/you:/branches:/systemsmanagement:/Uyuni:/Master/openSUSE_Leap_15.1/"
```
<!-- .element id="main-tf-tweak" class="fragment" -->

* <!-- .element id="sumaform-again" class="fragment" -->
  Rebuild sumaform from scratch
