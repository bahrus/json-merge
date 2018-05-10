[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://www.webcomponents.org/element/bahrus/json-merge)

# \<json-merge\>

json-merge is a dependency free web component.  It may make more sense to use in [disciplined, declarative markup-centric](https://blog.153.io/2017/03/08/you-dont-get-amp/) environments -- server-driven architectures or HTML template-oriented components / web apps, as opposed to the code-centric approach of (P)React / LitHTML / HyperHTML / etc.  

It's also useful for demo pages that use html markup as the primary way of demonstrating the functionality of a component.

The primary motivation for this component is as follows:

Many complex components, like grids, require a large amount of declarative configuration, beyond what is optimally configured via attributes.

Some of them, like the Vaadin grid, choose to configure this via light children.  This component is of no help in those circumstances.

Other components tend to view themselves primarily as a JavaScript api, and then just quickly put a web component wrapper around it.  The configuration needs to be passed in as a property, together with the actual dynamic data.  This component helps with that, so that boilerplate / risky code can be avoided.

It enforces the declarative, side-effect free, XSS safe principles by insisting that the content is strictly compliant JSON.  See [https://www.ampproject.org/docs/reference/components/amp-bind](other examples of allowing JSON to be embedded within a page).

By default, the JSON needs to be wrapped inside a script tag with type application/json, as shown below.

```html
<script type="application/json">
//JSON goes here
</script>
```

