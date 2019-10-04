<!-- .slide: data-state="section-break" id="code-overview" data-menu-title="Code Overview" data-timing="15" -->
# Code Overview 

Note:
* Agenda:
    * main blocks
    * main folders
    * workflows: Java & Web
    * Writing tests


<!-- .slide: data-state="normal" id="main-blocks" data-menu-title="Main Blocks" data-timing="120" -->
## Main Blocks

<div data-svg-fragment="images/main-blocks.svg#[*|label=base]" class="hcenter"
  style="height: 90%">
  <a class="fragment" title="[*|label=jsp]"/></a>
  <a class="fragment" title="[*|label=backend]"/></a>
  <a class="fragment" title="[*|label=spark]"/></a>
  <a class="fragment" title="[*|label=salt]"/></a>
</div>


<!-- .slide: data-state="normal" id="by-folder" data-menu-title="Main Folders" data-timing="120" -->
## Main Folders

* <!-- .element class="fragment" -->
  **java**: bulk of the code
* <!-- .element class="fragment" -->
  **web/html/src**: JS-based UI code
* <!-- .element class="fragment" -->
  **schema/spacewalk/common**: database definition
* <!-- .element class="fragment" -->
  **schema/spacewalk/upgrade**: database upgrade scripts
* <!-- .element class="fragment" -->
  **testsuite**: cucumber tests
* <!-- .element class="fragment" -->
  **susemanager-utils/susemanager-sls**: custom Salt states
* <!-- .element class="fragment" -->
  **susemanager-utils/testing**: tools for automated tests


<!-- .slide: data-state="normal" id="java-pointers" data-menu-title="Java Pointers" data-timing="120" -->
## Java Pointers

* <!-- .element class="fragment" -->
  Spark router: [com.suse.manager.webui.Router](https://github.com/uyuni-project/uyuni/blob/master/java/code/src/com/suse/manager/webui/Router.java)
* <!-- .element class="fragment" -->
  HTML pages templates: [com.suse.manager.webui.templates](https://github.com/uyuni-project/uyuni/tree/master/java/code/src/com/suse/manager/webui/templates)
* <!-- .element class="fragment" -->
  New UI Controllers: [com.suse.manager.webui.controller](https://github.com/uyuni-project/uyuni/tree/master/java/code/src/com/suse/manager/webui/controllers)
* <!-- .element class="fragment" -->
  Salt actions implementation: [com.suse.manager.webui.services.SaltServerActionService](https://github.com/uyuni-project/uyuni/blob/master/java/code/src/com/suse/manager/webui/services/SaltServerActionService.java)
*  <!-- .element class="fragment" -->
  Salt events listener: [com.suse.manager.reactor.SaltReactor](https://github.com/uyuni-project/uyuni/blob/master/java/code/src/com/suse/manager/reactor/SaltReactor.java)
* <!-- .element class="fragment" -->
  Data model and Hibernate bindings: [com.redhat.rhn.domain](https://github.com/uyuni-project/uyuni/tree/master/java/code/src/com/redhat/rhn/domain)
* <!-- .element class="fragment" -->
  Old UI + XMLRPC: [com.redhat.rhn.frontend](https://github.com/uyuni-project/uyuni/tree/master/java/code/src/com/redhat/rhn/frontend)


<!-- .slide: data-state="normal" id="java-workflow" data-menu-title="Java Workflow" data-timing="120" -->
## Java Workflow

* <!-- .element: class="fragment" -->
  Hack

* <!-- .element: class="fragment" -->
  Deploy on dev instance

  * <!-- .element: class="fragment" -->
    In `java/buildconf/manager-developer-build.properties` edit ``deploy.host``

```bash
ant -f manager-build.xml refresh-branding-jar \
    deploy restart-tomcat restart-taskomatic
```
<!-- .element: class="fragment" -->
 
* <!-- .element: class="fragment" -->
  Prepare packages

* <!-- .element: class="fragment" -->
  Deploy sumaform test instance

* <!-- .element: class="fragment" -->
  Write cucumber tests

* <!-- .element: class="fragment" -->
  Add entry in `java/spacewalk-java.changes`


<!-- .slide: data-state="normal" id="web-workflow" data-menu-title="Web Workflow" data-timing="120" -->
## Web Workflow

* <!-- .element: id="start-dev" class="fragment" -->
  Start dev instance

```bash
cd uyuni/web/html/src
yarn proxy --server https://dev-srv.tf.local
```
<!-- .element: id="yarn-proxy" class="fragment" -->

* <!-- .element: class="fragment" -->
  Hack

* <!-- .element: class="fragment" -->
  See changes live

* <!-- .element: class="fragment" -->
  Add entry in `web/spacewalk-web.changes`

<a class="fragment" href="https://github.com/uyuni-project/uyuni/wiki/Frontend-Development-Environment">
  https://github.com/uyuni-project/uyuni/wiki/Frontend-Development-Environment
</a>


<!-- .slide: data-state="normal" id="writing-tests" data-menu-title="Writing Tests" data-timing="120" -->
## Writing Tests

* Feature / Scenario / Steps
    * English only
    * Code in `testsuite/features/step_definitions`
* Existing steps in `testsuite/documentation/cucumber-steps.md`
* New **idempotent** features in `testsuite/features/secondary`


<!-- .slide: data-state="normal" id="test-example" data-menu-title="Test Example" data-timing="120" -->
## Test Example

```cucumber
@virthost_kvm
  Scenario: Resume a KVM virtual machine
    Given I am on the "Virtualization" page of this "kvm-server"
    When I wait until table row for "test-vm" contains button "Resume"
    And I click on "Resume" in row "test-vm"
    Then I should see "test-vm" virtual machine running on "kvm-server"
```
<!-- .element: id="test-cucumber" class="fragment" -->

```ruby
Then(/^I should see "([^"]*)" virtual machine (shut off|running|paused)
      on "([^"]*)"$/x) do |vm, state, host|
  node = get_target(host)
  repeat_until_timeout(message: "#{vm} virtual machine on #{host} "\
                                "never reached state #{state}") do
    output, _code = node.run("virsh domstate #{vm}")
    break if output.strip == state
    sleep 3
  end
end
```
<!-- .element: id="test-step" class="fragment" -->
