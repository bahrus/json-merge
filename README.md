# \<json-merge\>

Polymer component designed to merge JSON objects into other objects.

The primary motivation for this component is as follows:

Many complex components, like grids, require a large amount of declarative configuration, beyond what is optimally configured via attributes.

Some of them, like the Vaadin grid, choose to configure this via light children.  This component is of no help in those circumstances.

Other components tend to view themselves primarily as a JavaScript api, and then just quickly put a web component wrapper it.  The configuration needs to be passed in as a property, together with the actual dynamic data.  This component helps with that, so that boilerplate code can be avoided.

It enforces the declarative, side-effect free, XSS safe principles by insisting that the content is strictly compliant JSON.  See [https://www.ampproject.org/docs/reference/components/amp-bind] (other examples of allowing JSON to be embedded within a page).

## Install the Polymer-CLI

First, make sure you have the [Polymer CLI](https://www.npmjs.com/package/polymer-cli) installed. Then run `polymer serve` to serve your element locally.

## Viewing Your Element

```
$ polymer serve
```

## Running Tests

```
$ polymer test
```

Your application is already set up to be tested via [web-component-tester](https://github.com/Polymer/web-component-tester). Run `polymer test` to run your application's test suite locally.
