[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://www.webcomponents.org/element/bahrus/json-merge)

<a href="https://nodei.co/npm/xtal-json-merge/"><img src="https://nodei.co/npm/xtal-json-merge.png"></a>

<img src="https://badgen.net/bundlephobia/minzip/xtal-json-merge">

# \<xtal-json-merge\>



[Demo](https://xtal-json-editor-demo.glitch.me/) 

xtal-json-merge and xtal-insert-json merge predefined json with some dynamic json.  xtal-json-merge extends xtal-insert-json. They provide binding support compatible with Polymer 2/3, but they can be used in non Polymer settings as well.  They may seem more natural to use in [disciplined, declarative, data-centric](https://blog.153.io/2017/03/08/you-dont-get-amp/) environments -- server-driven architectures or HTML template-oriented components / web apps like VueJS, Polymer, Aurelia, Svelte, Angular. It is likely to cause an allergic reaction if found inside a JavaScript, code-centric render function, like those found in (P)React / LitHTML / HyperHTML / SkateJS / StencilJS, etc.  

These two components can also be useful for demo pages that use html markup as the primary way of demonstrating the functionality of specific types of components, which we categorize below.


## Mission

Many complex components, like grids or charts, require a large amount of declarative configuration, beyond what is optimally configured via attributes.

I would venture that 50% of UI Screens in the world consist of the following workflow:  

1)  Get data 
2)  Merge with configuration (and/or other manipulation of the data, not discussed here)
3)  Render using some specialized renderer (like a grid or chart component).  

We assume here that step 3 is:

1) done with another third party web component.  For simplicity we'll assume it's called my-grid
2) defined via some form of template markup i.e. \<my-grid\>

Some components, like the Vaadin grid, choose to be configured via light DOM elements (a perfectly fine approach).  This component is of no help in those circumstances.

Other components tend to view themselves primarily as a JavaScript api, and then just quickly put a web component wrapper around it. Often that api consists of a single function or two, with a single parameter, where declarative JSON is expected to be passed.  These components are designed to facilitate working with such components. 

These components, xtal-insert-json and xtal-json-merge, enforce the declarative, optimized, side-effect free, XSS safe principles by insisting that the content is strictly compliant JSON.  See [other examples of embedding JSON as part of the markup](https://www.ampproject.org/docs/reference/components/amp-bind).

Note that someone ([Νίκος](https://marketplace.visualstudio.com/items?itemName=sissel.json-script-tag)) has kindly provided a nice VSCode extension, that makes editing JSON much easier.

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
<!--- Petalia Syntax -->
<fetch-data dsiabled url="https://HRDatabase.com" output="{{rowData}}"></fetch-data>
<!-- pass down (p-d) value on fetch complete -->
<p-d on=fetch-complete [-input] m=1>
<xtal-insert-json  -input with-path="data">
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
<p-d on=merged-prop-changed to=[-grid-options] m=1>
<my-grid -grid-options></my-grid>
```


## Viewing Your Element

```
$ npm install
$ npm run serveserve
```

