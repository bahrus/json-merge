[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://www.webcomponents.org/element/bahrus/json-merge)

<a href="https://nodei.co/npm/xtal-json-merge/"><img src="https://nodei.co/npm/xtal-json-merge.png"></a>
# \<xtal-json-merge\>

[Demo](https://xtal-json-editor-demo.glitch.me/) 

xtal-json-merge and xtal-insert-json are dependency free web components, that merge predefined json with some dynamic json.  xtal-json-merge extends xtal-insert-json. They provide binding support compatible with Polymer, but they can be used in non Polymer settings as well.  It may seem more natural to use in [disciplined, declarative data-centric](https://blog.153.io/2017/03/08/you-dont-get-amp/) environments -- server-driven architectures or HTML template-oriented components / web apps like VueJS, Polymer (as we mentioned already), Aurelia, Svelte, Angular. It is likely to cause an allergic reaction if found inside a JavaScript, code-centric render function, like those found in (P)React / LitHTML / HyperHTML / SkateJS / StencilJS, etc.  

These two components can also be useful for demo pages that use html markup as the primary way of demonstrating the functionality of specific types of components, which we categorize below.


## Mission

Many complex components, like grids, require a large amount of declarative configuration, beyond what is optimally configured via attributes.

I would venture that 50% of UI Screens in the world consist of the following workflow:  

1)  Get data 
2)  Merge with configuration (and/or other manipulation of the data, not discussed here)
3)  Render using some specialized renderer (like a grid or chart component).  

We assume here that step 3 is:

1) done with another third party web component.  For simplicity we'll assume it's called my-grid
2) defined via some form of template markup i.e. \<my-grid\>

Some components, like the Vaadin grid, choose to be configured via light DOM elements (a perfectly fine approach).  This component is of no help in those circumstances.

Other components tend to view themselves primarily as a JavaScript api, and then just quickly put a web component wrapper around it. Often that api consists of a single function or two, with a single parameter, where declarative JSON is expected to be passed.  These components are designed to facilitate working with such components. 

These components, xtal-insert-json and xtal-json-merge, enforce the declarative, side-effect free, XSS safe principles by insisting that the content is strictly compliant JSON.  See [other examples of embedding JSON as part of the markup](https://www.ampproject.org/docs/reference/components/amp-bind).

The JSON needs to be wrapped inside a script tag with type application/json, as shown below.

```html
<xtal-insert-json>
<script type="application/json">
//JSON goes here
</script>
</xtal-insert-json>
```

## Example


```html
<!--- Polymer Syntax -->
<fetch-data url="https://HRDatabase.com" output="{{rowData}}"></fetch-data>
<xtal-insert-json  input="[[rowData]]" refs="[[formatters]]" with-path="data" merged-prop="{{employeeGridData}}">
    <script type="application/json">
    [{
        "columns":[
            {"id": "index",       "name": "Index",      "field": "index"},
            {"id": "isActive",    "name": "Active",     "field": "isActive"},
            {"id": "salary",     "name": "Salary",      "field": "balance", "formatter":  "${refs.dollarFormatter}"},
            {"id": "age",         "name": "Age",        "field": "age"},
            {"id": "eyeColor",    "name": "Eye Color",  "field": "eyeColor"},
            {"id": "name",        "name": "Name",       "field": "name"},
            {"id": "gender",      "name": "Gender",     "field": "gender"},
        ],
        "gridSettings":{
            "enableCellNavigation": true,
            "enableColumnReorder": false
        }
    }]
    </script>
</xtal-insert-json>
<my-grid grid-options="[[employeeGridData]]"></my-grid>
```



## Install the Polymer-CLI

First, make sure you have the [Polymer CLI](https://www.npmjs.com/package/polymer-cli) and npm (packaged with [Node.js](https://nodejs.org)) installed. Run `npm install` to install your element's dependencies, then run `polymer serve` to serve your element locally.

## Viewing Your Element

```
$ polymer serve
```

## Running Tests

```
$ polymer test
```

Your application is already set up to be tested via [web-component-tester](https://github.com/Polymer/web-component-tester). Run `polymer test` to run your application's test suite locally.
