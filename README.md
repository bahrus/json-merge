[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://www.webcomponents.org/element/bahrus/json-merge)

<a href="https://nodei.co/npm/xtal-json-merge/"><img src="https://nodei.co/npm/xtal-json-merge.png"></a>
# \<xtal-json-merge\>

[Demo](https://xtal-json-editor-demo.glitch.me/) 

xtal-json-merge and xtal-insert-json are dependency free web components, that merge predefined json with some dynamic json.  xtal-json-merge extends xtal-insert-json. They provide binding support compatible with Polymer, but they can be used in non Polymer settings as well.  It may make more sense to use in [disciplined, declarative markup-centric](https://blog.153.io/2017/03/08/you-dont-get-amp/) environments -- server-driven architectures or HTML template-oriented components / web apps like VueJS, Polymer (as we mentioned already), Aurelia, Svelte, Angular. It may seem somewhat jarring to see it inside a JavaScript, code-centric render function, like those found in (P)React / LitHTML / HyperHTML / SkateJS, etc.  More on that later.

These two components can also be useful for demo pages that use html markup as the primary way of demonstrating the functionality of specific types of components, which we categorize below.

xtal-insert-json.js is ~1.2KB minified and gzipped.  xtal-json-merge.js is ~1.4kb minified and gzipped.  Both require importing via ES6 Modules. 

The two files are combined into one IIFE file, json-merge.js, which can be imported via a classic script tag.  This combined file is ~2.0kb minified and gzipped

## Mission

Many complex components, like grids, require a large amount of declarative configuration, beyond what is optimally configured via attributes.

I would venture that 50% of UI Screens in the world consist of the following workflow:  

1)  Get data 
2)  Merge with configuration (and/or other manipulation of the data, not discussed here)
3)  Render using some specialized renderer (like a grid or chart component).  

We assume here that step 3 is:

1) done with another third party web component.  For simplicity we'll assume it's called my-grid
2) defined via some form of template markup i.e. \<my-grid\>

For productivity purposes, I like the places that define the first two steps to be as "physically close" to the place where the third step is defined as possible.  What this looks like in Polymer is a beauty to behold (according to my eye):


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

If you are not using Polymer, you can attach an event handler to the xtal-insert-json for event "merged-prop-changed" and add some boilerplate code to do the same thing.  However, xtal-insert-json, and xtal-merge-json provide some simpler ways of passing the data on. 

If you are using a top-down framework, but don't want to write repetitive code over and over again, you can simply do this:

```html
<!--- Polymer Syntax -->
<xtal-insert-json  input="[[rowData]]"  with-path="data" pass-down="gridOptions">
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
<my-grid></my-grid>
```

If you use xtal-fetch-get, it also supports the pass-down attribute.  So the complete markup looks like:

```html
<!--- Polymer Syntax -->
<xtal-fetch-get href="https://HRDatabase.com" pass-down="input"></fetch-data>
<xtal-insert-json  refs="[[formatters]]" with-path="data" pass-down="gridOptions">
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
<my-grid></my-grid>
```


The presence of attribute pass-down causes xtal-insert-json to search to set the property ("gridOptions" in this case) of the next element sibling specified to the value of the merged object.

xtal-json-merge provides some extra ways of passing the data to other elements if you need more power.

Here's why I like to keep this trio of tags (data retrieval, data merge, grid) cozily next to eachother:

1)  I can see at a glance the whole picture. This makes developing and debugging easy.
2)  If the grid needs to move elsewhere, it's a single cut and paste operation.

## You can't do that!

I have heard, but never understood, a great number of reasons why this love triangle should be torn apart.

###  Data flow must be unidirectional!

It is, the data flows down the page.

###  That has no place in a render function!

If a framework can't handle it running inside a render function, the framework needs to see a therapist for controlling issues. 

The UI is still a function of state.  All we've done is given some part of the rendering responsibility to json-merge (and of course the grid takes it from there).

### You're mixing concerns!

True, we are using different technologies, but there's only one concern -- show a grid with as little fuss as possible.

###  Isn't your component too thick?

I'm too thick to understand the question.

## When is json-merge useful?

Some components, like the Vaadin grid, choose to be configured via light DOM elements (a perfectly fine approach).  This component is of no help in those circumstances.

Other components tend to view themselves primarily as a JavaScript api, and then just quickly put a web component wrapper around it.  

These components, xtal-insert-json and xtal-json-merge, enforce the declarative, side-effect free, XSS safe principles by insisting that the content is strictly compliant JSON.  See [other examples of embedding JSON as part of the markup](https://www.ampproject.org/docs/reference/components/amp-bind).

The JSON needs to be wrapped inside a script tag with type application/json, as shown below.

```html
<xtal-insert-json>
<script type="application/json">
//JSON goes here
</script>
</xtal-insert-json>
```

During the parsing of the JSON, you can insert dynamic fields, if they are passed to the refs property of json-merge:

```html
<!--- Polymer Syntax -->
<xtal-insert-json  input="[[gridData]]" refs="[[formatters]]" with-path="data" merged-obj="{{gridOptions}}">
<script type="application/json">
[{
    "columns":[
        {"id": "index",       "name": "Index",      "field": "index"},
        {"id": "isActive",    "name": "Active",     "field": "isActive"},
        {"id": "balance",     "name": "Balance",    "field": "balance", "formatter":  "${refs.testFormatter}"},
        {"id": "age",         "name": "Age",        "field": "age"},
        {"id": "eyeColor",    "name": "Eye Color",  "field": "eyeColor"},
        {"id": "name",        "name": "Name",       "field": "name"},
        {"id": "gender",      "name": "Gender",     "field": "gender"},
        {"id": "company",     "name":"Company",     "field": "company"}
    ],
    "gridSettings":{
        "enableCellNavigation": true,
        "enableColumnReorder": false
    }
}]
</script>
</xtal-insert-json>
<my-grid gridOptions="[[gridOptions]]"></my-grid>
```

By default, the mergedObject property / event raises an event containing the merged object.  And we've already discussed an alternative way of passing the data, using attribute "pass-down."

xtal-json-merge, which extends xtal-insert-json, supports additional ways of handling the merged object.  You can specify a callback function

```html
<!--- Polymer Syntax -->
<xtal-json-merge  input="[[gridData]]" refs="[[formatters]]" with-path="data" post-merge-callback-fn="[[renderGrid]]">
<script type="application/json">
...
</script>
</xtal-json-merge>
<my-grid>
```

If you would rather not write such a function, nor an event handler, and the pass-down attribute isn't powerful enough for your needs, you can alternatively specify where to pass it to.

```html
<!--- Polymer Syntax -->
<xtal-json-merge  input="[[gridData]]" refs="[[formatters]]" with-path="data" pass-to="my-grid{gridOptions:detail.mergedObject}">
<script type="application/json">
...
</script>
</xtal-json-merge>
<my-grid></my-grid>
```

The query for my-grid will begin from the parent DOM element (or shadowRoot fragment). 

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
